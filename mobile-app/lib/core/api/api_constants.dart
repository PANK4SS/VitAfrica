class ApiConstants {
  // Railway production host (backend exposed publicly).
  // Internal app port is 8080 on Railway, edge URL is HTTPS.
  static const String baseHost = 'https://vitafrica-production.up.railway.app';

  // Base URL for mobile patient API (must match backend controller)
  // Backend: @RequestMapping("/api/patients/mobile") in PatientController
  static const String baseUrl = '$baseHost/api/patients/mobile';

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
