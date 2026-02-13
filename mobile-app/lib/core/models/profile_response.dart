class ProfileResponse {
  final String? profilePicUrl;
  final String? name;
  final String? email;
  final String? phone;
  final String? locationAddress;

  ProfileResponse({
    this.profilePicUrl,
    this.name,
    this.email,
    this.phone,
    this.locationAddress,
  });

  factory ProfileResponse.fromJson(Map<String, dynamic> json) {
    return ProfileResponse(
      profilePicUrl: json['profilePicUrl'],
      name: json['name'],
      email: json['email'],
      phone: json['phone'],
      locationAddress: json['locationAddress'],
    );
  }
}
