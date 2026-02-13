import 'package:flutter/material.dart';
import '../../core/theme/colors.dart';

class PrescriptionsScreen extends StatelessWidget {
  const PrescriptionsScreen({super.key});

  // Mock data matching PrescriptionResponse(id, date, doctorName, doctorDepartment, drugs[])
  // with DrugResponse(drugName, dosage, frequency, duration)
  List<Map<String, dynamic>> get _mockPrescriptions => [
    {
      'id': 1,
      'date': '10/02/2026',
      'doctorName': 'Dr. Jean Mukendi',
      'doctorDepartment': 'Cardiologie',
      'drugs': [
        {
          'drugName': 'Amlodipine',
          'dosage': '5mg',
          'frequency': '1x/jour',
          'duration': '30 jours',
        },
        {
          'drugName': 'Aspirine',
          'dosage': '100mg',
          'frequency': '1x/jour',
          'duration': '90 jours',
        },
      ],
    },
    {
      'id': 2,
      'date': '25/01/2026',
      'doctorName': 'Dr. Marie Kabila',
      'doctorDepartment': 'Dermatologie',
      'drugs': [
        {
          'drugName': 'Crème Hydrocortisone',
          'dosage': '1%',
          'frequency': '2x/jour',
          'duration': '14 jours',
        },
      ],
    },
    {
      'id': 3,
      'date': '15/12/2025',
      'doctorName': 'Dr. Paul Tshisekedi',
      'doctorDepartment': 'Médecine Générale',
      'drugs': [
        {
          'drugName': 'Paracétamol',
          'dosage': '500mg',
          'frequency': '3x/jour',
          'duration': '5 jours',
        },
        {
          'drugName': 'Amoxicilline',
          'dosage': '1g',
          'frequency': '2x/jour',
          'duration': '7 jours',
        },
        {
          'drugName': 'Ibuprofène',
          'dosage': '400mg',
          'frequency': '2x/jour',
          'duration': '5 jours',
        },
      ],
    },
  ];

  @override
  Widget build(BuildContext context) {
    final prescriptions = _mockPrescriptions;

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
                    'Prescriptions',
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${prescriptions.length} prescriptions',
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
                itemCount: prescriptions.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final rx = prescriptions[index];
                  return _PrescriptionCard(prescription: rx);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PrescriptionCard extends StatefulWidget {
  final Map<String, dynamic> prescription;

  const _PrescriptionCard({required this.prescription});

  @override
  State<_PrescriptionCard> createState() => _PrescriptionCardState();
}

class _PrescriptionCardState extends State<_PrescriptionCard>
    with SingleTickerProviderStateMixin {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    final rx = widget.prescription;
    final drugs = rx['drugs'] as List<Map<String, dynamic>>;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
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
      child: Column(
        children: [
          // Header (tappable)
          InkWell(
            onTap: () => setState(() => _isExpanded = !_isExpanded),
            borderRadius: BorderRadius.circular(16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  // Prescription icon
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Icon(
                      Icons.receipt_long,
                      color: AppColors.primary,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          rx['doctorName'],
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: AppColors.primary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          rx['doctorDepartment'],
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.grey[600],
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Icon(
                              Icons.calendar_today,
                              size: 12,
                              color: Colors.grey[500],
                            ),
                            const SizedBox(width: 4),
                            Text(
                              rx['date'],
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey[500],
                              ),
                            ),
                            const SizedBox(width: 12),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.secondary.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text(
                                '${drugs.length} médicament${drugs.length > 1 ? 's' : ''}',
                                style: const TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.primary,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  AnimatedRotation(
                    turns: _isExpanded ? 0.5 : 0,
                    duration: const Duration(milliseconds: 200),
                    child: Icon(
                      Icons.keyboard_arrow_down,
                      color: Colors.grey[400],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Expandable drug list
          AnimatedCrossFade(
            firstChild: const SizedBox.shrink(),
            secondChild: Column(
              children: [
                Divider(height: 1, color: Colors.grey[200]),
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
                  child: Column(
                    children: drugs.map((drug) => _buildDrugRow(drug)).toList(),
                  ),
                ),
              ],
            ),
            crossFadeState: _isExpanded
                ? CrossFadeState.showSecond
                : CrossFadeState.showFirst,
            duration: const Duration(milliseconds: 250),
          ),
        ],
      ),
    );
  }

  Widget _buildDrugRow(Map<String, dynamic> drug) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: Colors.orange.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.medication, color: Colors.orange, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  drug['drugName'],
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '${drug['dosage']} · ${drug['frequency']} · ${drug['duration']}',
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
