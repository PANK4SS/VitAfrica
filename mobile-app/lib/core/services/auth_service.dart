import 'dart:convert';
import 'package:flutter/foundation.dart';
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

    debugPrint('Login status: ${response.statusCode}');
    debugPrint('Login body: ${response.body}');

    if (response.statusCode == 200) {
      if (response.body.isEmpty) {
        throw Exception('Server returned empty response');
      }
      final authResponse = AuthResponse.fromJson(jsonDecode(response.body));
      await TokenStorage.saveToken(authResponse.accessToken);
      return authResponse;
    } else {
      throw Exception(_extractErrorMessage(response.body, 'Login failed'));
    }
  }

  /// Register a new patient account
  static Future<void> register({
    required String username,
    required String email,
    required String password,
    required String phone,
    required String locationAddress,
    required String profilePicUrl,
  }) async {
    final response = await ApiClient.postNoAuth(ApiConstants.registerEndpoint, {
      'username': username,
      'email': email,
      'password': password,
      'phone': phone,
      'locationAddress': locationAddress,
      'profilePicUrl': profilePicUrl,
    });

    debugPrint('Register status: ${response.statusCode}');
    debugPrint('Register body: ${response.body}');

    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception(
        _extractErrorMessage(response.body, 'Registration failed'),
      );
    }
  }

  /// Clear the stored token
  static Future<void> logout() async {
    await TokenStorage.deleteToken();
  }

  /// Safely extract error message from response body
  static String _extractErrorMessage(String body, String fallback) {
    if (body.isEmpty) return fallback;
    try {
      final decoded = jsonDecode(body);
      if (decoded is Map<String, dynamic>) {
        return decoded['message'] ?? decoded['error'] ?? fallback;
      }
      return body;
    } catch (_) {
      // Response body isn't JSON (e.g. plain text error from Spring)
      return body.length > 200 ? '${body.substring(0, 200)}...' : body;
    }
  }
}
