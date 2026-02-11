import 'package:flutter/material.dart';

class BottomNavigation extends StatelessWidget {
  const BottomNavigation({
    Key? key,
    required this.activeIndex,
  }) : super(key: key);

  final int activeIndex; // 0: Accueil, 1: RDV, 2: Soins, 3: Résultats, 4: Profil

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(
                context: context,
                icon: Icons.home_outlined,
                label: 'Accueil',
                isActive: activeIndex == 0,
                onTap: () => Navigator.pushReplacementNamed(context, '/home'),
              ),
              _buildNavItem(
                context: context,
                icon: Icons.calendar_today_outlined,
                label: 'RDV',
                isActive: activeIndex == 1,
                onTap: () => Navigator.pushReplacementNamed(context, '/rdv'),
              ),
              _buildNavItem(
                context: context,
                icon: Icons.medication_outlined,
                label: 'Soins',
                isActive: activeIndex == 2,
                onTap: () => Navigator.pushReplacementNamed(context, '/ordonnances'),
              ),
              _buildNavItem(
                context: context,
                icon: Icons.description_outlined,
                label: 'Résultats',
                isActive: activeIndex == 3,
                onTap: () => Navigator.pushReplacementNamed(context, '/resultats'),
              ),
              _buildNavItem(
                context: context,
                icon: Icons.person_outline,
                label: 'Profil',
                isActive: activeIndex == 4,
                onTap: () => Navigator.pushReplacementNamed(context, '/profile'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem({
    required BuildContext context,
    required IconData icon,
    required String label,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: isActive ? const Color(0xFF5B4CFF) : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  color: isActive ? Colors.white : Colors.grey[400],
                  size: 24,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  color: isActive ? const Color(0xFF5B4CFF) : Colors.grey[400],
                  fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
