import 'package:flutter/material.dart';
import '../../core/theme/colors.dart';

class AppointmentsScreen extends StatelessWidget {
  const AppointmentsScreen({super.key});

  // Mock data matching AppointmentResponse(id, date, hour, status, doctorName, doctorDepartment)
  List<Map<String, dynamic>> get _mockAppointments => [
    {
      'id': 1,
      'date': '2026-02-15',
      'hour': '09:30',
      'status': 'CONFIRMED',
      'doctorName': 'Dr. Jean Mukendi',
      'doctorDepartment': 'Cardiologie',
    },
    {
      'id': 2,
      'date': '2026-02-10',
      'hour': '14:00',
      'status': 'COMPLETED',
      'doctorName': 'Dr. Marie Kabila',
      'doctorDepartment': 'Dermatologie',
    },
    {
      'id': 3,
      'date': '2026-01-28',
      'hour': '11:00',
      'status': 'COMPLETED',
      'doctorName': 'Dr. Paul Tshisekedi',
      'doctorDepartment': 'Médecine Générale',
    },
    {
      'id': 4,
      'date': '2026-01-15',
      'hour': '08:30',
      'status': 'CONFIRMED',
      'doctorName': 'Dr. Sarah Lumumba',
      'doctorDepartment': 'Pédiatrie',
    },
    {
      'id': 5,
      'date': '2025-12-20',
      'hour': '16:00',
      'status': 'COMPLETED',
      'doctorName': 'Dr. Jean Mukendi',
      'doctorDepartment': 'Cardiologie',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final appointments = _mockAppointments;

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
                    'Appointments',
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${appointments.length} appointments',
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
                itemCount: appointments.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final appt = appointments[index];
                  return _buildAppointmentCard(appt);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAppointmentCard(Map<String, dynamic> appt) {
    final isConfirmed = appt['status'] == 'CONFIRMED';

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
          // Date column
          Container(
            width: 56,
            padding: const EdgeInsets.symmetric(vertical: 10),
            decoration: BoxDecoration(
              color: isConfirmed
                  ? AppColors.secondary.withOpacity(0.2)
                  : Colors.blue.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                Text(
                  appt['date'].toString().split('-')[2],
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: isConfirmed ? AppColors.primary : Colors.blue[700],
                  ),
                ),
                Text(
                  _monthName(appt['date'].toString().split('-')[1]),
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: isConfirmed ? AppColors.primary : Colors.blue[700],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 14),

          // Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  appt['doctorName'],
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  appt['doctorDepartment'],
                  style: TextStyle(fontSize: 13, color: Colors.grey[600]),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Icon(Icons.access_time, size: 14, color: Colors.grey[500]),
                    const SizedBox(width: 4),
                    Text(
                      appt['hour'],
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.grey[600],
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Status chip
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: isConfirmed
                  ? Colors.green.withOpacity(0.1)
                  : Colors.blue.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              appt['status'],
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: isConfirmed ? Colors.green[700] : Colors.blue[700],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _monthName(String month) {
    const months = {
      '01': 'JAN',
      '02': 'FEB',
      '03': 'MAR',
      '04': 'APR',
      '05': 'MAY',
      '06': 'JUN',
      '07': 'JUL',
      '08': 'AUG',
      '09': 'SEP',
      '10': 'OCT',
      '11': 'NOV',
      '12': 'DEC',
    };
    return months[month] ?? month;
  }
}
