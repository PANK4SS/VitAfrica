class LabResultResponse {
  final int id;
  final String fileName;
  final String fileUrl;
  final String uploadedAt;

  LabResultResponse({
    required this.id,
    required this.fileName,
    required this.fileUrl,
    required this.uploadedAt,
  });

  factory LabResultResponse.fromJson(Map<String, dynamic> json) {
    return LabResultResponse(
      id: json['labResultId'] ?? 0,
      fileName: json['fileName'] ?? '',
      fileUrl: json['fileUrl'] ?? '',
      uploadedAt: json['uploadedAt'] ?? '',
    );
  }

  static List<LabResultResponse> fromJsonList(List<dynamic> jsonList) {
    return jsonList.map((json) => LabResultResponse.fromJson(json)).toList();
  }
}
