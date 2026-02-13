class AppointmentResponse {
  final int id;
  final String date;
  final String hour;
  final String status;
  final String? doctorName;
  final String? doctorDepartment;

  AppointmentResponse({
    required this.id,
    required this.date,
    required this.hour,
    required this.status,
    this.doctorName,
    this.doctorDepartment,
  });

  factory AppointmentResponse.fromJson(Map<String, dynamic> json) {
    return AppointmentResponse(
      id: json['appointmentId'] ?? 0,
      date: json['date'] ?? '',
      hour: json['hour'] ?? '',
      status: json['status'] ?? '',
      doctorName: json['doctorName'],
      doctorDepartment: json['doctorDepartment'],
    );
  }

  static List<AppointmentResponse> fromJsonList(List<dynamic> jsonList) {
    return jsonList.map((json) => AppointmentResponse.fromJson(json)).toList();
  }
}
