import 'package:flutter/material.dart';
import '../../core/theme/colors.dart';

class LabResultsScreen extends StatelessWidget {
  const LabResultsScreen({super.key});

  // Mock data matching LabResultResponse(id, fileName, fileUrl, uploadedAt)
  List<Map<String, dynamic>> get _mockLabResults => [
    {
      'id': 1,
      'fileName': 'Bilan Sanguin Complet.pdf',
      'fileUrl': 'https://example.com/lab1.pdf',
      'uploadedAt': '10/02/2026 14:30',
    },
    {
      'id': 2,
      'fileName': 'Analyse Urinaire.pdf',
      'fileUrl': 'https://example.com/lab2.pdf',
      'uploadedAt': '25/01/2026 09:15',
    },
    {
      'id': 3,
      'fileName': 'Glycémie à jeun.pdf',
      'fileUrl': 'https://example.com/lab3.pdf',
      'uploadedAt': '15/12/2025 11:00',
    },
    {
      'id': 4,
      'fileName': 'Radiographie Thorax.pdf',
      'fileUrl': 'https://example.com/lab4.pdf',
      'uploadedAt': '01/12/2025 16:45',
    },
    {
      'id': 5,
      'fileName': 'Échographie Abdominale.pdf',
      'fileUrl': 'https://example.com/lab5.pdf',
      'uploadedAt': '10/11/2025 08:20',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final labResults = _mockLabResults;

    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Lab Results',
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${labResults.length} results',
                    style: TextStyle(fontSize: 14, color: Colors.grey[500]),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // List
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                itemCount: labResults.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final lab = labResults[index];
                  return _buildLabResultCard(lab);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLabResultCard(Map<String, dynamic> lab) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // File icon
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: Colors.red.withOpacity(0.08),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(
              Icons.picture_as_pdf,
              color: Colors.red,
              size: 26,
            ),
          ),
          const SizedBox(width: 14),

          // Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  lab['fileName'],
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Icon(Icons.access_time, size: 13, color: Colors.grey[500]),
                    const SizedBox(width: 4),
                    Text(
                      lab['uploadedAt'],
                      style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Download button
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.08),
              borderRadius: BorderRadius.circular(12),
            ),
            child: IconButton(
              icon: const Icon(
                Icons.download_rounded,
                color: AppColors.primary,
                size: 22,
              ),
              onPressed: () {
                // TODO: Integrate download logic
              },
            ),
          ),
        ],
      ),
    );
  }
}
