import 'package:flutter/material.dart';

// Service de notifications simplifié (sans dépendances externes)
class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  Future<void> initialize() async {
    // Initialisation simplifiée
    print('Service de notifications initialisé');
  }

  Future<void> scheduleRdvReminder({
    required String title,
    required String body,
    required DateTime scheduledTime,
    required String rdvId,
  }) async {
    // Simulation de programmation de notification
    print('Notification programmée: $title à $scheduledTime');

    // Dans une vraie implémentation, utiliser flutter_local_notifications
    // Pour l'instant, on simule avec un message
  }

  Future<void> showImmediateNotification({
    required String title,
    required String body,
  }) async {
    // Simulation de notification immédiate
    print('Notification immédiate: $title - $body');
  }

  Future<void> cancelNotification(int id) async {
    print('Notification $id annulée');
  }

  Future<void> cancelAllNotifications() async {
    print('Toutes les notifications annulées');
  }
}

// Widget pour la page de gestion des notifications
class NotificationSettingsPage extends StatefulWidget {
  const NotificationSettingsPage({Key? key}) : super(key: key);

  @override
  State<NotificationSettingsPage> createState() =>
      _NotificationSettingsPageState();
}

class _NotificationSettingsPageState extends State<NotificationSettingsPage> {
  final NotificationService _notificationService = NotificationService();

  bool _rdvRemindersEnabled = true;
  bool _medicationRemindersEnabled = false;
  bool _appointmentRemindersEnabled = true;
  int _reminderAdvance = 60; // minutes
  String _selectedSound = 'default';

  @override
  void initState() {
    super.initState();
    _initializeNotifications();
  }

  Future<void> _initializeNotifications() async {
    await _notificationService.initialize();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        backgroundColor: const Color(0xFF0A1647),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Section Rappels RDV
            _buildSectionTitle('Rappels de rendez-vous'),
            const SizedBox(height: 16),

            _buildSwitchTile(
              title: 'Rappels de RDV',
              subtitle: 'Recevoir des notifications avant vos rendez-vous',
              value: _rdvRemindersEnabled,
              onChanged: (value) {
                setState(() {
                  _rdvRemindersEnabled = value;
                });
              },
            ),
            const SizedBox(height: 16),

            if (_rdvRemindersEnabled) ...[
              _buildAdvanceSelector(),
              const SizedBox(height: 16),
            ],

            // Section Médicaments
            _buildSectionTitle('Médicaments'),
            const SizedBox(height: 16),

            _buildSwitchTile(
              title: 'Rappels de médicaments',
              subtitle: 'Notifications pour la prise de médicaments',
              value: _medicationRemindersEnabled,
              onChanged: (value) {
                setState(() {
                  _medicationRemindersEnabled = value;
                });
              },
            ),
            const SizedBox(height: 16),

            // Section Autres rappels
            _buildSectionTitle('Autres rappels'),
            const SizedBox(height: 16),

            _buildSwitchTile(
              title: 'Rappels d\'ordonnances',
              subtitle: 'Notifications pour le renouvellement d\'ordonnances',
              value: _appointmentRemindersEnabled,
              onChanged: (value) {
                setState(() {
                  _appointmentRemindersEnabled = value;
                });
              },
            ),
            const SizedBox(height: 16),

            // Section Son
            _buildSectionTitle('Son et vibration'),
            const SizedBox(height: 16),

            _buildSoundSelector(),
            const SizedBox(height: 32),

            // Bouton de test
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: _testNotification,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFB4FF00),
                  foregroundColor: Colors.black,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Tester les notifications',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.bold,
        color: Color(0xFF0A1647),
      ),
    );
  }

  Widget _buildSwitchTile({
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF0A1647),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: const Color(0xFF0A1647),
          ),
        ],
      ),
    );
  }

  Widget _buildAdvanceSelector() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Avance du rappel',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Color(0xFF0A1647),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: Slider(
                  value: _reminderAdvance.toDouble(),
                  min: 15,
                  max: 180,
                  divisions: 11,
                  label: '$_reminderAdvance min',
                  onChanged: (value) {
                    setState(() {
                      _reminderAdvance = value.round();
                    });
                  },
                  activeColor: const Color(0xFF0A1647),
                ),
              ),
              const SizedBox(width: 16),
              Text(
                '$_reminderAdvance min',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF0A1647),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSoundSelector() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Son de notification',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Color(0xFF0A1647),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: DropdownButtonFormField<String>(
                  value: _selectedSound,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                  ),
                  items: const [
                    DropdownMenuItem(
                      value: 'default',
                      child: Text('Par défaut'),
                    ),
                    DropdownMenuItem(value: 'gentle', child: Text('Doux')),
                    DropdownMenuItem(value: 'urgent', child: Text('Urgent')),
                    DropdownMenuItem(value: 'calm', child: Text('Calme')),
                  ],
                  onChanged: (value) {
                    setState(() {
                      _selectedSound = value!;
                    });
                  },
                ),
              ),
              const SizedBox(width: 16),
              IconButton(
                onPressed: _playSound,
                icon: const Icon(Icons.play_arrow),
                style: IconButton.styleFrom(
                  backgroundColor: const Color(0xFF0A1647),
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _testNotification() async {
    await _notificationService.showImmediateNotification(
      title: 'Test de notification',
      body: 'Ceci est un test des notifications VitAfrica',
    );
  }

  void _playSound() {
    // Simuler la lecture du son
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Lecture du son: $_selectedSound'),
        backgroundColor: const Color(0xFF0A1647),
      ),
    );
  }
}
