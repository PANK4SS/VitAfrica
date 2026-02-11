import 'package:flutter/material.dart';

class RdvFormPage extends StatefulWidget {
  const RdvFormPage({Key? key, this.initialTabIndex = 0}) : super(key: key);

  final int initialTabIndex; // 0 pour Prendre RDV, 1 pour Historique

  @override
  State<RdvFormPage> createState() => _RdvFormPageState();
}

class _RdvFormPageState extends State<RdvFormPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Form controllers
  final _doctorController = TextEditingController();
  final _dateController = TextEditingController();
  final _timeController = TextEditingController();
  final _reasonController = TextEditingController();
  String _selectedSpecialty = 'Généraliste';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(
      length: 2,
      vsync: this,
      initialIndex: widget.initialTabIndex,
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    _doctorController.dispose();
    _dateController.dispose();
    _timeController.dispose();
    _reasonController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rendez-vous'),
        backgroundColor: const Color(0xFF0A1647),
        foregroundColor: Colors.white,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFFB4FF00),
          labelColor: const Color(0xFFB4FF00),
          unselectedLabelColor: Colors.white,
          tabs: const [
            Tab(text: 'Prendre RDV'),
            Tab(text: 'Historique'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          SingleChildScrollView(child: _buildRdvForm()),
          SingleChildScrollView(child: _buildHistory()),
        ],
      ),
    );
  }

  Widget _buildRdvForm() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Nouveau Rendez-vous',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Color(0xFF0A1647),
            ),
          ),
          const SizedBox(height: 25),

          // Spécialité
          const Text(
            'Spécialité',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Color(0xFF0A1647),
            ),
          ),
          const SizedBox(height: 8),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey[300]!),
              borderRadius: BorderRadius.circular(12),
              color: Colors.grey[50],
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _selectedSpecialty,
                items:
                    const [
                      'Généraliste',
                      'Cardiologue',
                      'Dermatologue',
                      'Gynécologue',
                      'Pédiatre',
                      'Ophtalmologue',
                      'ORL',
                      'Radiologue',
                    ].map((String value) {
                      return DropdownMenuItem<String>(
                        value: value,
                        child: Text(value),
                      );
                    }).toList(),
                onChanged: (String? newValue) {
                  setState(() {
                    _selectedSpecialty = newValue!;
                  });
                },
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Médecin
          const Text(
            'Médecin',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Color(0xFF0A1647),
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _doctorController,
            decoration: InputDecoration(
              hintText: 'Nom du médecin',
              filled: true,
              fillColor: Colors.grey[50],
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              contentPadding: const EdgeInsets.all(16),
            ),
          ),
          const SizedBox(height: 16),

          // Date
          const Text(
            'Date',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Color(0xFF0A1647),
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _dateController,
            readOnly: true,
            onTap: () async {
              DateTime? pickedDate = await showDatePicker(
                context: context,
                initialDate: DateTime.now(),
                firstDate: DateTime.now(),
                lastDate: DateTime(2025),
              );
              if (pickedDate != null) {
                setState(() {
                  _dateController.text =
                      "${pickedDate.day}/${pickedDate.month}/${pickedDate.year}";
                });
              }
            },
            decoration: InputDecoration(
              hintText: 'Sélectionner une date',
              prefixIcon: const Icon(Icons.calendar_today),
              filled: true,
              fillColor: Colors.grey[50],
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              contentPadding: const EdgeInsets.all(16),
            ),
          ),
          const SizedBox(height: 16),

          // Heure
          const Text(
            'Heure',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Color(0xFF0A1647),
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _timeController,
            readOnly: true,
            onTap: () async {
              TimeOfDay? pickedTime = await showTimePicker(
                context: context,
                initialTime: TimeOfDay.now(),
              );
              if (pickedTime != null) {
                setState(() {
                  _timeController.text =
                      "${pickedTime.hour.toString().padLeft(2, '0')}:${pickedTime.minute.toString().padLeft(2, '0')}";
                });
              }
            },
            decoration: InputDecoration(
              hintText: 'Sélectionner une heure',
              prefixIcon: const Icon(Icons.access_time),
              filled: true,
              fillColor: Colors.grey[50],
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              contentPadding: const EdgeInsets.all(16),
            ),
          ),
          const SizedBox(height: 16),

          // Motif
          const Text(
            'Motif du rendez-vous',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Color(0xFF0A1647),
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _reasonController,
            maxLines: 3,
            decoration: InputDecoration(
              hintText: 'Décrivez le motif de votre visite...',
              filled: true,
              fillColor: Colors.grey[50],
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              contentPadding: const EdgeInsets.all(16),
            ),
          ),
          const SizedBox(height: 30),

          // Bouton de confirmation
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton(
              onPressed: () {
                _confirmRdv();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0A1647),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Confirmer le rendez-vous',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHistory() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Historique des rendez-vous',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Color(0xFF0A1647),
            ),
          ),
          const SizedBox(height: 20),

          // Liste des RDV passés et à venir
          _buildRdvCard(
            date: '15 Mars 2024',
            time: '10:30',
            doctor: 'Dr. Konaté',
            specialty: 'Cardiologue',
            status: 'confirmé',
            color: Colors.green,
          ),
          const SizedBox(height: 12),

          _buildRdvCard(
            date: '08 Mars 2024',
            time: '14:00',
            doctor: 'Dr. Traoré',
            specialty: 'Généraliste',
            status: 'terminé',
            color: Colors.grey,
          ),
          const SizedBox(height: 12),

          _buildRdvCard(
            date: '22 Mars 2024',
            time: '09:00',
            doctor: 'Dr. Ouattara',
            specialty: 'Dermatologue',
            status: 'confirmé',
            color: Colors.green,
          ),
          const SizedBox(height: 12),

          _buildRdvCard(
            date: '01 Mars 2024',
            time: '11:15',
            doctor: 'Dr. Bamba',
            specialty: 'Pédiatre',
            status: 'annulé',
            color: Colors.red,
          ),
        ],
      ),
    );
  }

  Widget _buildRdvCard({
    required String date,
    required String time,
    required String doctor,
    required String specialty,
    required String status,
    required Color color,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '$date • $time',
                style: TextStyle(fontSize: 14, color: Colors.grey[600]),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  status.toUpperCase(),
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: color,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            doctor,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Color(0xFF0A1647),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            specialty,
            style: TextStyle(fontSize: 14, color: Colors.grey[600]),
          ),
        ],
      ),
    );
  }

  void _confirmRdv() {
    if (_doctorController.text.isEmpty ||
        _dateController.text.isEmpty ||
        _timeController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Veuillez remplir tous les champs obligatoires'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    // Afficher un message de confirmation
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Rendez-vous confirmé!'),
          content: Text(
            'Votre rendez-vous avec ${_doctorController.text} le ${_dateController.text} à ${_timeController.text} a été confirmé.',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                Navigator.of(context).pop(); // Retour à la page RDV
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }
}
