import 'package:flutter/material.dart';
import 'pages/connexion_page.dart';
import 'pages/inscription_page.dart';
import 'pages/home_page.dart';
import 'pages/mes_rdv_page.dart';
import 'pages/ordonnances_page.dart';
import 'pages/resultats_labo_page.dart';
import 'pages/profile_page.dart';
import 'pages/rdv_form_page.dart';
import 'pages/urgences_page.dart';
import 'pages/edit_profile_page.dart';
import 'services/notification_service_simple.dart';

void main() {
  runApp(const VitAfricaApp());
}

class VitAfricaApp extends StatelessWidget {
  const VitAfricaApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'VitAfrica',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(primarySwatch: Colors.blue, fontFamily: 'SF Pro'),
      // Démarre sur la page de connexion
      home: const ConnexionPage(),
      routes: {
        '/connexion': (context) => const ConnexionPage(),
        '/inscription': (context) => const InscriptionPage(),
        '/home': (context) => const HomePage(),
        '/rdv': (context) => const MesRDVPage(),
        '/rdv_form': (context) => const RdvFormPage(),
        '/rdv_history': (context) => const RdvFormPage(initialTabIndex: 1),
        '/ordonnances': (context) => const OrdonnancesPage(),
        '/resultats': (context) => const ResultatsLaboPage(),
        '/profile': (context) => const ProfilePage(),
        '/edit_profile': (context) => const EditProfilePage(),
        '/urgences': (context) => const UrgencesPage(),
        '/notifications': (context) => const NotificationSettingsPage(),
      },
    );
  }
}
