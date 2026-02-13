class HomeResponse {
  // Profile
  final String? userName;
  final String? profilePic;
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
    this.userName,
    this.profilePic,
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
      // Backend MobileHomeResponse uses: userName, profilePic
      userName: json['userName'],
      profilePic: json['profilePic'],
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
