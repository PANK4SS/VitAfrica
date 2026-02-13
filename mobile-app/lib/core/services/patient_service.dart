import 'dart:convert';
import '../api/api_client.dart';
import '../api/api_constants.dart';
import '../models/home_response.dart';
import '../models/appointment_response.dart';
import '../models/prescription_response.dart';
import '../models/lab_result_response.dart';
import '../models/profile_response.dart';

class PatientService {
  static Future<HomeResponse> getHome() async {
    final response = await ApiClient.get(ApiConstants.homeEndpoint);

    if (response.statusCode == 200) {
      if (response.body.isEmpty) {
        throw Exception('Empty response from server (home)');
      }
      return HomeResponse.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load home data');
    }
  }

  static Future<List<AppointmentResponse>> getAppointments() async {
    final response = await ApiClient.get(ApiConstants.appointmentsEndpoint);

    if (response.statusCode == 200) {
      if (response.body.isEmpty) {
        throw Exception('Empty response from server (appointments)');
      }
      return AppointmentResponse.fromJsonList(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load appointments');
    }
  }

  static Future<List<PrescriptionResponse>> getPrescriptions() async {
    final response = await ApiClient.get(ApiConstants.prescriptionsEndpoint);

    if (response.statusCode == 200) {
      if (response.body.isEmpty) {
        throw Exception('Empty response from server (prescriptions)');
      }
      return PrescriptionResponse.fromJsonList(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load prescriptions');
    }
  }

  static Future<List<LabResultResponse>> getLabResults() async {
    final response = await ApiClient.get(ApiConstants.labResultsEndpoint);

    if (response.statusCode == 200) {
      if (response.body.isEmpty) {
        throw Exception('Empty response from server (lab results)');
      }
      return LabResultResponse.fromJsonList(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load lab results');
    }
  }

  static Future<ProfileResponse> getProfile() async {
    final response = await ApiClient.get(ApiConstants.profileEndpoint);

    if (response.statusCode == 200) {
      if (response.body.isEmpty) {
        throw Exception('Empty response from server (profile)');
      }
      return ProfileResponse.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load profile');
    }
  }
}
