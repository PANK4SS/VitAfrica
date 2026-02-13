class ApiConstants {
  // Base URL for mobile patient API (must match backend controller)
  // Backend: @RequestMapping("/api/patients/mobile") in PatientController
  static const String baseUrl =
      'http://192.168.100.202:8080/api/patients/mobile';

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
