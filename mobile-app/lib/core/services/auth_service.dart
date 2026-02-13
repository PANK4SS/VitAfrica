import 'dart:convert';
import '../api/api_client.dart';
import '../api/api_constants.dart';
import '../api/token_storage.dart';
import '../models/auth_response.dart';

class AuthService {
  /// Login with email and password, stores the JWT token
  static Future<AuthResponse> login(String email, String password) async {
    final response = await ApiClient.postNoAuth(ApiConstants.loginEndpoint, {
      'email': email,
      'password': password,
    });

    if (response.statusCode == 200) {
      final authResponse = AuthResponse.fromJson(jsonDecode(response.body));
      await TokenStorage.saveToken(authResponse.token);
      return authResponse;
    } else {
      final errorBody = jsonDecode(response.body);
      throw Exception(errorBody['message'] ?? 'Login failed');
    }
  }

  /// Register a new patient account
  static Future<void> register({
    required String username,
    required String email,
    required String password,
    required String phone,
    required String locationAddress,
    String? profilePicUrl,
  }) async {
    final response = await ApiClient.postNoAuth(ApiConstants.registerEndpoint, {
      'username': username,
      'email': email,
      'password': password,
      'phone': phone,
      'locationAddress': locationAddress,
      'profilePicUrl': profilePicUrl ?? '',
    });

    if (response.statusCode != 200 && response.statusCode != 201) {
      final errorBody = jsonDecode(response.body);
      throw Exception(errorBody['message'] ?? 'Registration failed');
    }
  }

  /// Clear the stored token
  static Future<void> logout() async {
    await TokenStorage.deleteToken();
  }
}
