package com.dumenciler.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dumenciler.dto.DtoLoginRequest;
import com.dumenciler.dto.DtoLoginResponse;
import com.dumenciler.dto.DtoRegisterRequest;
import com.dumenciler.dto.DtoUser;
import com.dumenciler.dto.DtoUserIU;
import com.dumenciler.entities.User;
import com.dumenciler.repository.UserRepository;
import com.dumenciler.services.IEmailService;
import com.dumenciler.services.IUserService;

@Service
public class UserServiceImpl implements IUserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private IEmailService emailService;

	@Override
	public DtoUser saveUser(DtoUserIU dtoUser) {
		DtoUser response = new DtoUser();
		User user = new User();
		BeanUtils.copyProperties(dtoUser, user);

		User dbUser = userRepository.save(user);
		BeanUtils.copyProperties(dbUser, response);
		return response;
	}

	@Override
	public List<DtoUser> getAllUser() {
		List<DtoUser> dtoList = new ArrayList<>();
		List<User> userList = userRepository.findAll();

		for (User user : userList) {
			DtoUser dto = new DtoUser();
			BeanUtils.copyProperties(user, dto);
			dtoList.add(dto);
		}
		return dtoList;
	}

	@Override
	public DtoUser getUserById(Integer id) {
		DtoUser dto = new DtoUser();
		Optional<User> optional = userRepository.findById(id);
		if (optional.isPresent()) {
			User dbUser = optional.get();
			BeanUtils.copyProperties(dbUser, dto);
		}
		return dto;
	}

	@Override
	public void deleteUser(Integer id) {
		Optional<User> optional = userRepository.findById(id);
		if (optional.isPresent()) {
			userRepository.delete(optional.get());
		}
	}

	@Override
	public DtoUser updateUser(Integer id, DtoUserIU dtoUserIU) {
		DtoUser dtoUser = new DtoUser();

		Optional<User> optional = userRepository.findById(id);

		if (optional.isPresent()) {
			User dbUser = optional.get();

			// 1. İsim ve Soyisim Güncelleme (Zorunlu alanlar gibi davranıyoruz)
			if (dtoUserIU.getFirstName() != null && !dtoUserIU.getFirstName().isEmpty()) {
				dbUser.setFirstName(dtoUserIU.getFirstName());
			}
			if (dtoUserIU.getLastName() != null && !dtoUserIU.getLastName().isEmpty()) {
				dbUser.setLastName(dtoUserIU.getLastName());
			}

			// 2. Kullanıcı Adı Güncelleme (Opsiyonel)
			if (dtoUserIU.getUsername() != null && !dtoUserIU.getUsername().isEmpty()) {
				// Burada benzersizlik kontrolü yapılabilir ama şimdilik basit tutuyoruz
				dbUser.setUsername(dtoUserIU.getUsername());
			}

			// 2.1 Email Güncelleme (Opsiyonel)
			if (dtoUserIU.getEmail() != null && !dtoUserIU.getEmail().isEmpty()) {
				// Eğer email değişiyorsa, başkasında var mı diye bakmak lazım (benzersizlik)
				if (!dbUser.getEmail().equals(dtoUserIU.getEmail())) {
					User existing = userRepository.findByEmail(dtoUserIU.getEmail());
					if (existing != null) {
						return null; // Email kullanımda
					}
					dbUser.setEmail(dtoUserIU.getEmail());
				}
			}

			// 3. Şifre Güncelleme Mantığı (Güvenli değişim)
			// Eğer yeni şifre (password) gönderilmişse
			if (dtoUserIU.getPassword() != null && !dtoUserIU.getPassword().isEmpty()) {
				// Ve mevcut şifre (currentPassword) de gönderilmişse ve veritabanındakiyle
				// uyuşuyorsa
				if (dtoUserIU.getCurrentPassword() != null
						&& dbUser.getPassword().equals(dtoUserIU.getCurrentPassword())) {
					// Şifreyi güncelle
					dbUser.setPassword(dtoUserIU.getPassword());
				} else {
					// Şifre yanlışsa veya girilmemişse null dönerek işlemin başarısız olduğunu
					// belirtiyoruz
					// İsterseniz burada özel bir Exception fırlatıp Controller'da
					// yakalayabilirsiniz.
					return null;
				}
			}

			User updatedUser = userRepository.save(dbUser);

			// DtoUser nesnesine kopyala (DtoUser'da username/password olmadığı için sadece
			// isimler dönecek)
			BeanUtils.copyProperties(updatedUser, dtoUser);

			return dtoUser;
		}
		return null;
	}

	@Override
	public DtoLoginResponse login(DtoLoginRequest dtoLoginRequest) {
		System.out.println("Login attempt for email: " + dtoLoginRequest.getEmail());

		User user = userRepository.findByEmail(dtoLoginRequest.getEmail());
		DtoLoginResponse response = new DtoLoginResponse();

		if (user == null) {
			System.out.println("User not found: " + dtoLoginRequest.getEmail());
			response.setMessage("User not found!");
			return response;
		}

		System.out.println("User found. DB Password: " + user.getPassword() + ", Request Password: "
				+ dtoLoginRequest.getPassword());

		if (user.getPassword().equals(dtoLoginRequest.getPassword())) {
			response.setId(user.getId());
			response.setFirstName(user.getFirstName());
			response.setLastName(user.getLastName());
			response.setMessage("Login successful!");
			response.setRole(user.getRole());
			System.out.println("Login successful for user: " + user.getId());
		} else {
			System.out.println("Password mismatch for user: " + user.getId());
			response.setMessage("Invalid username or password!");
		}

		return response;
	}

	@Override
	public DtoLoginResponse register(DtoRegisterRequest dtoRegisterRequest) {
		DtoLoginResponse response = new DtoLoginResponse();

		if (userRepository.findByEmail(dtoRegisterRequest.getEmail()) != null) {
			response.setMessage("Email already exists!");
			return response;
		}

		if (userRepository.findByUsername(dtoRegisterRequest.getUsername()) != null) {
			response.setMessage("Username already exists!");
			return response;
		}

		User newUser = new User();
		newUser.setFirstName(dtoRegisterRequest.getFirstName());
		newUser.setLastName(dtoRegisterRequest.getLastName());
		newUser.setUsername(dtoRegisterRequest.getUsername());
		newUser.setEmail(dtoRegisterRequest.getEmail());
		newUser.setEmail(dtoRegisterRequest.getEmail());
		newUser.setPassword(dtoRegisterRequest.getPassword());
		newUser.setRole(com.dumenciler.entities.Role.USER); // Default role

		User saved = userRepository.save(newUser);

		response.setId(saved.getId());
		response.setFirstName(saved.getFirstName());
		response.setLastName(saved.getLastName());
		response.setMessage("Registration successful!");
		return response;
	}

	@Override
	public String forgotPassword(String email) {
		User user = userRepository.findByEmail(email);
		if (user == null) {

			throw new RuntimeException("User not found with email: " + email);
		}

		String token = java.util.UUID.randomUUID().toString();
		user.setResetToken(token);
		user.setResetTokenExpiryDate(java.time.LocalDateTime.now().plusHours(1));
		userRepository.save(user);

		// Send Email
		String resetUrl = "http://localhost:3000/reset-password?token=" + token;
		emailService.sendResetPasswordEmail(email, resetUrl);

		return token; // Return token for easy testing
	}

	@Override
	public boolean resetPassword(String token, String newPassword) {
		User user = userRepository.findAll().stream()
				.filter(u -> token.equals(u.getResetToken()))
				.findFirst()
				.orElse(null);

		if (user == null) {
			return false;
		}

		if (user.getResetTokenExpiryDate().isBefore(java.time.LocalDateTime.now())) {
			return false;
		}

		user.setPassword(newPassword);
		user.setResetToken(null);
		user.setResetTokenExpiryDate(null);
		userRepository.save(user);

		return true;
	}
}