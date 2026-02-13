import 'package:flutter/material.dart';
import '../../core/theme/colors.dart';
import '../../core/services/patient_service.dart';
import '../../core/models/appointment_response.dart';

class AppointmentsScreen extends StatefulWidget {
  const AppointmentsScreen({super.key});

  @override
  State<AppointmentsScreen> createState() => _AppointmentsScreenState();
}

class _AppointmentsScreenState extends State<AppointmentsScreen> {
  List<AppointmentResponse>? _appointments;
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final data = await PatientService.getAppointments();
      if (mounted) {
        setState(() {
          _appointments = data;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString().replaceFirst('Exception: ', '');
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
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
                    _isLoading
                        ? 'Loading...'
                        : '${_appointments?.length ?? 0} appointments',
                    style: TextStyle(fontSize: 14, color: Colors.grey[500]),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Content
            Expanded(
              child: _isLoading
                  ? const Center(
                      child: CircularProgressIndicator(
                        color: AppColors.primary,
                      ),
                    )
                  : _error != null
                  ? _buildErrorState()
                  : _appointments!.isEmpty
                  ? _buildEmptyState()
                  : RefreshIndicator(
                      color: AppColors.primary,
                      onRefresh: _loadData,
                      child: ListView.separated(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        itemCount: _appointments!.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          return _buildAppointmentCard(_appointments![index]);
                        },
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.cloud_off, size: 48, color: Colors.grey[400]),
          const SizedBox(height: 12),
          Text(_error!, style: TextStyle(color: Colors.grey[600])),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            onPressed: () {
              setState(() {
                _isLoading = true;
                _error = null;
              });
              _loadData();
            },
            icon: const Icon(Icons.refresh, size: 18),
            label: const Text('Retry'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.calendar_today, size: 48, color: Colors.grey[400]),
          const SizedBox(height: 12),
          Text(
            'No appointments yet',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAppointmentCard(AppointmentResponse appt) {
    final isConfirmed = appt.status == 'CONFIRMED';

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
                  appt.date.split('-').length >= 3
                      ? appt.date.split('-')[2]
                      : appt.date,
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: isConfirmed ? AppColors.primary : Colors.blue[700],
                  ),
                ),
                Text(
                  appt.date.split('-').length >= 2
                      ? _monthName(appt.date.split('-')[1])
                      : '',
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
                  appt.doctorName ?? 'Doctor',
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  appt.doctorDepartment ?? '',
                  style: TextStyle(fontSize: 13, color: Colors.grey[600]),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Icon(Icons.access_time, size: 14, color: Colors.grey[500]),
                    const SizedBox(width: 4),
                    Text(
                      appt.hour,
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
              appt.status,
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
