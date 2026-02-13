class AuthResponse {
  final String accessToken;
  final String refreshToken;
  final String email;
  final String clientName;

  AuthResponse({
    required this.accessToken,
    required this.refreshToken,
    required this.email,
    required this.clientName,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      accessToken: json['accessToken'] ?? '',
      refreshToken: json['refreshToken'] ?? '',
      email: json['email'] ?? '',
      clientName: json['clientName'] ?? '',
    );
  }
}
