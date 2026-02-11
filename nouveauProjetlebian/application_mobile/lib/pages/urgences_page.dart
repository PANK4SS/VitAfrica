import 'package:flutter/material.dart';

class UrgencesPage extends StatefulWidget {
  const UrgencesPage({Key? key}) : super(key: key);

  @override
  State<UrgencesPage> createState() => _UrgencesPageState();
}

class _UrgencesPageState extends State<UrgencesPage> {
  final List<EmergencyContact> _emergencyContacts = [
    EmergencyContact(
      name: 'SAMU',
      number: '15',
      description: 'Urgences médicales',
      icon: Icons.local_hospital,
      color: Colors.red,
    ),
    EmergencyContact(
      name: 'Pompiers',
      number: '18',
      description: 'Incendie et secours',
      icon: Icons.local_fire_department,
      color: Colors.orange,
    ),
    EmergencyContact(
      name: 'Police',
      number: '17',
      description: 'Urgences policières',
      icon: Icons.local_police,
      color: Colors.blue,
    ),
    EmergencyContact(
      name: 'Centre Anti-Poison',
      number: '3324',
      description: 'Intoxications',
      icon: Icons.science,
      color: Colors.purple,
    ),
  ];

  final List<Hospital> _hospitals = [
    Hospital(
      name: 'CHU Yopougon',
      address: 'Abidjan, Yopougon',
      distance: '2.5 km',
      rating: 4.2,
      hasEmergency: true,
      coordinates: '5.3600° N, 4.0084° W',
    ),
    Hospital(
      name: 'CHU Treichville',
      address: 'Abidjan, Treichville',
      distance: '3.8 km',
      rating: 4.0,
      hasEmergency: true,
      coordinates: '5.2933° N, 4.0167° W',
    ),
    Hospital(
      name: 'Clinique Bietry',
      address: 'Abidjan, Plateau',
      distance: '1.2 km',
      rating: 4.5,
      hasEmergency: true,
      coordinates: '5.3364° N, 4.0297° W',
    ),
    Hospital(
      name: 'Hôpital Général',
      address: 'Abidjan, Cocody',
      distance: '4.1 km',
      rating: 3.8,
      hasEmergency: false,
      coordinates: '5.3636° N, 3.9989° W',
    ),
  ];

  final List<Pharmacy> _pharmacies = [
    Pharmacy(
      name: 'Pharmacie du Centre',
      address: 'Abidjan, Plateau',
      distance: '0.8 km',
      isOpen: true,
      isGuard: true,
      coordinates: '5.3364° N, 4.0297° W',
    ),
    Pharmacy(
      name: 'Pharmacie de la Santé',
      address: 'Abidjan, Cocody',
      distance: '2.3 km',
      isOpen: true,
      isGuard: false,
      coordinates: '5.3636° N, 3.9989° W',
    ),
    Pharmacy(
      name: 'Pharmacie du Bonheur',
      address: 'Abidjan, Yopougon',
      distance: '3.1 km',
      isOpen: false,
      isGuard: true,
      coordinates: '5.3600° N, 4.0084° W',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Urgences'),
        backgroundColor: const Color(0xFF0A1647),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline),
            onPressed: () => _showInfoDialog(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Section Numéros d'urgence
            _buildSectionTitle('Numéros d\'urgence'),
            const SizedBox(height: 12),
            _buildEmergencyContacts(),
            const SizedBox(height: 24),

            // Section Hôpitaux proches
            _buildSectionTitle('Hôpitaux proches'),
            const SizedBox(height: 12),
            _buildHospitalsList(),
            const SizedBox(height: 24),

            // Section Pharmacies de garde
            _buildSectionTitle('Pharmacies de garde'),
            const SizedBox(height: 12),
            _buildPharmaciesList(),
            const SizedBox(height: 24),

            // Section Carte
            _buildSectionTitle('Carte des services'),
            const SizedBox(height: 12),
            _buildMapSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.bold,
        color: Color(0xFF0A1647),
      ),
    );
  }

  Widget _buildEmergencyContacts() {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 1.2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: _emergencyContacts.length,
      itemBuilder: (context, index) {
        final contact = _emergencyContacts[index];
        return _buildEmergencyCard(contact);
      },
    );
  }

  Widget _buildEmergencyCard(EmergencyContact contact) {
    return GestureDetector(
      onTap: () => _makeEmergencyCall(contact.number),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: contact.color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: contact.color.withOpacity(0.3)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: contact.color,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                contact.icon,
                color: Colors.white,
                size: 24,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              contact.name,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: contact.color,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              contact.number,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0A1647),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              contact.description,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHospitalsList() {
    return Column(
      children: _hospitals.map((hospital) => _buildHospitalCard(hospital)).toList(),
    );
  }

  Widget _buildHospitalCard(Hospital hospital) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
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
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      hospital.name,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF0A1647),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      hospital.address,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
              Column(
                children: [
                  Row(
                    children: [
                      const Icon(Icons.star, color: Colors.amber, size: 16),
                      const SizedBox(width: 4),
                      Text(
                        hospital.rating.toString(),
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  if (hospital.hasEmergency)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.red.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        'Urgences',
                        style: TextStyle(
                          fontSize: 10,
                          color: Colors.red,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Icon(Icons.location_on, color: Colors.grey[400], size: 16),
              const SizedBox(width: 4),
              Text(
                hospital.distance,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
              const Spacer(),
              ElevatedButton.icon(
                onPressed: () => _openMap(hospital.coordinates),
                icon: const Icon(Icons.map, size: 16),
                label: const Text('Itinéraire'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0A1647),
                  foregroundColor: Colors.white,
                  minimumSize: const Size(100, 32),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPharmaciesList() {
    return Column(
      children: _pharmacies.map((pharmacy) => _buildPharmacyCard(pharmacy)).toList(),
    );
  }

  Widget _buildPharmacyCard(Pharmacy pharmacy) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
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
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  pharmacy.name,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0A1647),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  pharmacy.address,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Row(
                children: [
                  Icon(
                    Icons.access_time,
                    color: pharmacy.isOpen ? Colors.green : Colors.red,
                    size: 16,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    pharmacy.isOpen ? 'Ouvert' : 'Fermé',
                    style: TextStyle(
                      fontSize: 12,
                      color: pharmacy.isOpen ? Colors.green : Colors.red,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              if (pharmacy.isGuard)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.orange.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    'Garde',
                    style: TextStyle(
                      fontSize: 10,
                      color: Colors.orange,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMapSection() {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: Stack(
        children: [
          // Placeholder pour la carte
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.map_outlined,
                  size: 48,
                  color: Colors.grey[400],
                ),
                const SizedBox(height: 8),
                Text(
                  'Carte des services médicaux',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Intégration Google Maps en cours...',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[500],
                  ),
                ),
              ],
            ),
          ),
          // Boutons d'action sur la carte
          Positioned(
            bottom: 12,
            right: 12,
            child: Column(
              children: [
                FloatingActionButton(
                  mini: true,
                  onPressed: () => _centerOnUser(),
                  backgroundColor: Colors.white,
                  child: const Icon(Icons.my_location, color: Color(0xFF0A1647)),
                ),
                const SizedBox(height: 8),
                FloatingActionButton(
                  mini: true,
                  onPressed: () => _showMapFilters(),
                  backgroundColor: Colors.white,
                  child: const Icon(Icons.filter_list, color: Color(0xFF0A1647)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _makeEmergencyCall(String number) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Appel d\'urgence'),
          content: Text('Voulez-vous appeler le $number ?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Annuler'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                // Simuler l'appel (dans une vraie app, utiliser url_launcher)
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Appel du $number en cours...'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
              ),
              child: const Text('Appeler'),
            ),
          ],
        );
      },
    );
  }

  void _openMap(String coordinates) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Ouverture de Google Maps...'),
        backgroundColor: const Color(0xFF0A1647),
      ),
    );
  }

  void _centerOnUser() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Centrage sur votre position...'),
        backgroundColor: const Color(0xFF0A1647),
      ),
    );
  }

  void _showMapFilters() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Filtres de la carte'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CheckboxListTile(
                title: const Text('Hôpitaux'),
                value: true,
                onChanged: (value) {},
              ),
              CheckboxListTile(
                title: const Text('Pharmacies'),
                value: true,
                onChanged: (value) {},
              ),
              CheckboxListTile(
                title: const Text('Cliniques'),
                value: false,
                onChanged: (value) {},
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Appliquer'),
            ),
          ],
        );
      },
    );
  }

  void _showInfoDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Informations importantes'),
          content: const Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Numéros d\'urgence',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              Text('• SAMU: 15 - Urgences médicales'),
              Text('• Pompiers: 18 - Incendie et secours'),
              Text('• Police: 17 - Urgences policières'),
              SizedBox(height: 16),
              Text(
                'Conseils',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              Text('• Gardez toujours ces numéros à portée'),
              Text('• En cas d\'urgence, restez calme'),
              Text('• Donnez votre localisation précise'),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('J\'ai compris'),
            ),
          ],
        );
      },
    );
  }
}

class EmergencyContact {
  final String name;
  final String number;
  final String description;
  final IconData icon;
  final Color color;

  EmergencyContact({
    required this.name,
    required this.number,
    required this.description,
    required this.icon,
    required this.color,
  });
}

class Hospital {
  final String name;
  final String address;
  final String distance;
  final double rating;
  final bool hasEmergency;
  final String coordinates;

  Hospital({
    required this.name,
    required this.address,
    required this.distance,
    required this.rating,
    required this.hasEmergency,
    required this.coordinates,
  });
}

class Pharmacy {
  final String name;
  final String address;
  final String distance;
  final bool isOpen;
  final bool isGuard;
  final String coordinates;

  Pharmacy({
    required this.name,
    required this.address,
    required this.distance,
    required this.isOpen,
    required this.isGuard,
    required this.coordinates,
  });
}
