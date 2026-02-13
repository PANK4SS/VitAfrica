import 'package:flutter/material.dart';
import 'theme/theme.dart';
import '../features/splash/splash_screen.dart';

class VitAfricaApp extends StatelessWidget {
  const VitAfricaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'VitAfrica',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const SplashScreen(),
    );
  }
}
