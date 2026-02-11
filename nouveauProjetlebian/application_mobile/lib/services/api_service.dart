import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Configuration de base - MODIFIEZ CETTE URL
  static const String baseUrl = 'https://votre-backend-url.com/api';
  static const Duration timeout = Duration(seconds: 30);
  
  // Headers par défaut
  static Map<String, String> _getHeaders({String? token}) {
    Map<String, String> headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }
    
    return headers;
  }

  // ==================== AUTHENTIFICATION ====================
  
  /// Connexion utilisateur
  static Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: _getHeaders(),
        body: jsonEncode({'email': email, 'password': password}),
      ).timeout(timeout);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'data': data,
          'token': data['token'] ?? data['access_token'],
        };
      } else {
        return {
          'success': false,
          'error': 'Email ou mot de passe incorrect',
        };
      }
    } catch (e) {
      return {'success': false, 'error': 'Erreur de connexion: $e'};
    }
  }

  /// Inscription utilisateur
  static Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String phone,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: _getHeaders(),
        body: jsonEncode({
          'name': name,
          'email': email,
          'phone': phone,
          'password': password,
        }),
      ).timeout(timeout);

      return response.statusCode == 201 
        ? {'success': true, 'message': 'Inscription réussie'}
        : {'success': false, 'error': 'Erreur lors de l\'inscription'};
    } catch (e) {
      return {'success': false, 'error': 'Erreur: $e'};
    }
  }

  // ==================== RENDEZ-VOUS ====================
  
  /// Obtenir l'historique des rendez-vous
  static Future<Map<String, dynamic>> getHistoriqueRendezVous(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/rendezvous/historique'),
        headers: _getHeaders(token: token),
      ).timeout(timeout);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {'success': true, 'data': data['historique'] ?? data};
      } else {
        return {'success': false, 'error': 'Erreur lors de la récupération'};
      }
    } catch (e) {
      return {'success': false, 'error': 'Erreur: $e'};
    }
  }

  // ==================== PROFIL ====================
  
  /// Obtenir le profil utilisateur
  static Future<Map<String, dynamic>> getProfile(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/profile'),
        headers: _getHeaders(token: token),
      ).timeout(timeout);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {'success': true, 'data': data['user'] ?? data};
      } else {
        return {'success': false, 'error': 'Erreur profil'};
      }
    } catch (e) {
      return {'success': false, 'error': 'Erreur: $e'};
    }
  }

  // ==================== AUTRES SERVICES ===================
  
  /// Obtenir les ordonnances
  static Future<Map<String, dynamic>> getOrdonnances(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/ordonnances'),
        headers: _getHeaders(token: token),
      ).timeout(timeout);
      return response.statusCode == 200 
        ? {'success': true, 'data': jsonDecode(response.body)}
        : {'success': false, 'error': 'Erreur ordonnances'};
    } catch (e) {
      return {'success': false, 'error': 'Erreur: $e'};
    }
  }

  /// Obtenir les résultats de laboratoire
  static Future<Map<String, dynamic>> getResultatsLabo(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/resultats-labo'),
        headers: _getHeaders(token: token),
      ).timeout(timeout);
      return response.statusCode == 200 
        ? {'success': true, 'data': jsonDecode(response.body)}
        : {'success': false, 'error': 'Erreur résultats'};
    } catch (e) {
      return {'success': false, 'error': 'Erreur: $e'};
    }
  }

  /// Obtenir les constantes médicales
  static Future<Map<String, dynamic>> getConstantes(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/constantes'),
        headers: _getHeaders(token: token),
      ).timeout(timeout);
      return response.statusCode == 200 
        ? {'success': true, 'data': jsonDecode(response.body)}
        : {'success': false, 'error': 'Erreur constantes'};
    } catch (e) {
      return {'success': false, 'error': 'Erreur: $e'};
    }
  }
}
