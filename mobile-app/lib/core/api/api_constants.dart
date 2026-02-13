class ApiConstants {
  // Android Emulator → localhost
  static const String baseUrl = 'http://10.0.2.2:8080/api/mobile/patient';

  // Auth
  static const String loginEndpoint = '$baseUrl/login';
  static const String registerEndpoint = '$baseUrl/register';

  // Data
  static const String homeEndpoint = '$baseUrl/home';
  static const String appointmentsEndpoint = '$baseUrl/appointments';
  static const String prescriptionsEndpoint = '$baseUrl/prescriptions';
  static const String labResultsEndpoint = '$baseUrl/lab-results';
  static const String profileEndpoint = '$baseUrl/profile';
}
