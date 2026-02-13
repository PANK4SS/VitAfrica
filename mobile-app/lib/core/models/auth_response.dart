class AuthResponse {
  final String token;
  final String tokenType;

  AuthResponse({required this.token, required this.tokenType});

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      token: json['token'] ?? '',
      tokenType: json['tokenType'] ?? 'Bearer',
    );
  }
}
