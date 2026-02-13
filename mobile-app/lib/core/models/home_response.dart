class HomeResponse {
  // Profile
  final String? clientName;
  final String? profilePicUrl;
  // Appointment
  final String? date;
  final String? hour;
  final String? appointmentStatus;
  final String? doctorName;
  final String? doctorDepartment;
  // Vital Signs
  final String? bloodPressure;
  final String? heartRate;
  final String? temperature;
  final String? weight;
  final String? dateMeasured;

  HomeResponse({
    this.clientName,
    this.profilePicUrl,
    this.date,
    this.hour,
    this.appointmentStatus,
    this.doctorName,
    this.doctorDepartment,
    this.bloodPressure,
    this.heartRate,
    this.temperature,
    this.weight,
    this.dateMeasured,
  });

  factory HomeResponse.fromJson(Map<String, dynamic> json) {
    return HomeResponse(
      clientName: json['clientName'],
      profilePicUrl: json['profilePicUrl'],
      date: json['date'],
      hour: json['hour'],
      appointmentStatus: json['appointmentStatus'],
      doctorName: json['doctorName'],
      doctorDepartment: json['doctorDepartment'],
      bloodPressure: json['bloodPressure'],
      heartRate: json['heartRate'],
      temperature: json['temperature'],
      weight: json['weight'],
      dateMeasured: json['dateMeasured'],
    );
  }
}
