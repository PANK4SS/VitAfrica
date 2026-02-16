class DrugResponse {
  final String drugName;
  final String dosage;
  final String frequency;
  final String durationDays;

  DrugResponse({
    required this.drugName,
    required this.dosage,
    required this.frequency,
    required this.durationDays,
  });

  factory DrugResponse.fromJson(Map<String, dynamic> json) {
    return DrugResponse(
      drugName: json['drugName'] ?? '',
      dosage: json['dosage'] ?? '',
      frequency: json['frequency'] ?? '',
      durationDays: json['durationDays'] ?? '',
    );
  }
}

class PrescriptionResponse {
  final int id;
  final String date;
  final String doctorName;
  final String doctorDepartment;
  final List<DrugResponse> drugs;

  PrescriptionResponse({
    required this.id,
    required this.date,
    required this.doctorName,
    required this.doctorDepartment,
    required this.drugs,
  });

  factory PrescriptionResponse.fromJson(Map<String, dynamic> json) {
    return PrescriptionResponse(
      id: json['prescriptionId'] ?? 0,
      date: json['date'] ?? '',
      doctorName: json['doctorName'] ?? '',
      doctorDepartment: json['doctorDepartment'] ?? '',
      drugs:
          (json['drugs'] as List<dynamic>?)
              ?.map((d) => DrugResponse.fromJson(d))
              .toList() ??
          [],
    );
  }

  static List<PrescriptionResponse> fromJsonList(List<dynamic> jsonList) {
    return jsonList.map((json) => PrescriptionResponse.fromJson(json)).toList();
  }
}
