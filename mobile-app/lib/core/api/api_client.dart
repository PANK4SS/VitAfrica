import 'dart:convert';
import 'package:http/http.dart' as http;
import 'token_storage.dart';

class ApiClient {
  /// GET request with automatic Bearer token injection
  static Future<http.Response> get(String url) async {
    final token = await TokenStorage.getToken();
    final response = await http.get(
      Uri.parse(url),
      headers: {
        'Content-Type': 'application/json',
        // Avoid any intermediate caching so UI reflects backend changes without logout.
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
    return response;
  }

  /// POST request with JSON body and automatic Bearer token injection
  static Future<http.Response> post(
    String url,
    Map<String, dynamic> body,
  ) async {
    final token = await TokenStorage.getToken();
    final response = await http.post(
      Uri.parse(url),
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode(body),
    );
    return response;
  }

  /// POST request without auth (for login/register)
  static Future<http.Response> postNoAuth(
    String url,
    Map<String, dynamic> body,
  ) async {
    final response = await http.post(
      Uri.parse(url),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(body),
    );
    return response;
  }
}
