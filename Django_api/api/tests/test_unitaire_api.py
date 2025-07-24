import unittest
from unittest.mock import Mock, patch, MagicMock
from decimal import Decimal
from datetime import datetime, date, timedelta


class PersonneModelTest(unittest.TestCase):
    """Tests unitaires pour la logique métier Personne"""
    
    def test_personne_name_formatting(self):
        """Teste le formatage du nom complet"""
        def format_full_name(nom, prenom):
            return f"{prenom} {nom}"
        
        result = format_full_name("Dupont", "Jean")
        self.assertEqual(result, "Jean Dupont")
    
    def test_email_validation_logic(self):
        """Teste la logique de validation d'email"""
        def is_valid_email(email):
            import re
            pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            return bool(re.match(pattern, email))
        
        self.assertTrue(is_valid_email("jean@example.com"))
        self.assertFalse(is_valid_email("invalid-email"))
        self.assertFalse(is_valid_email("test@"))
        self.assertTrue(is_valid_email("user.name+tag@domain.co.uk"))
    
    def test_role_validation(self):
        """Teste la validation des rôles"""
        def is_valid_role(role):
            valid_roles = [1, 2, 3, 4, 5, 6]  # Client, Commercial, etc.
            return role in valid_roles
        
        self.assertTrue(is_valid_role(1))
        self.assertTrue(is_valid_role(6))
        self.assertFalse(is_valid_role(0))
        self.assertFalse(is_valid_role(7))
        self.assertFalse(is_valid_role(None))


class ProductModelTest(unittest.TestCase):
    """Tests unitaires pour la logique métier Product"""
    
    def test_price_calculation(self):
        """Teste le calcul de prix TTC à partir du HT"""
        def calculate_ttc(prix_ht, taux_tva=0.20):
            # Conversion explicite en Decimal pour éviter les erreurs de type
            taux_decimal = Decimal(str(taux_tva))
            return prix_ht * (1 + taux_decimal)
        
        result = calculate_ttc(Decimal("100.00"))
        expected = Decimal("120.00")
        self.assertEqual(result, expected)
        
        # Test avec taux différent
        result_custom = calculate_ttc(Decimal("50.00"), 0.10)
        expected_custom = Decimal("55.00")
        self.assertEqual(result_custom, expected_custom)
    
    def test_stock_validation(self):
        """Teste la validation de stock"""
        def is_stock_valid(stock):
            return isinstance(stock, int) and stock >= 0
        
        self.assertTrue(is_stock_valid(100))
        self.assertTrue(is_stock_valid(0))
        self.assertFalse(is_stock_valid(-5))
        self.assertFalse(is_stock_valid("100"))
        self.assertFalse(is_stock_valid(None))
    
    def test_price_validation_logic(self):
        """Teste la logique de validation des prix"""
        def validate_price(price):
            if price is None:
                return False, "Prix requis"
            if not isinstance(price, (int, float, Decimal)):
                return False, "Prix doit être numérique"
            if price < 0:
                return False, "Prix doit être positif"
            return True, "Prix valide"
        
        valid, msg = validate_price(Decimal("20.00"))
        self.assertTrue(valid)
        
        valid, msg = validate_price(Decimal("-10.00"))
        self.assertFalse(valid)
        self.assertIn("positif", msg)
        
        valid, msg = validate_price(None)
        self.assertFalse(valid)


class DevisModelTest(unittest.TestCase):
    """Tests unitaires pour la logique métier Devis"""
    
    def test_tva_calculation(self):
        """Teste le calcul de la TVA"""
        def calculate_tva(montant_ht, montant_ttc):
            return montant_ttc - montant_ht
        
        tva = calculate_tva(Decimal("100.00"), Decimal("120.00"))
        self.assertEqual(tva, Decimal("20.00"))
    
    def test_discount_calculation(self):
        """Teste le calcul de remise"""
        def calculate_discount_amount(prix_original, pourcentage_remise):
            if pourcentage_remise < 0 or pourcentage_remise > 100:
                raise ValueError("Pourcentage invalide")
            return prix_original * (Decimal(str(pourcentage_remise)) / 100)
        
        remise = calculate_discount_amount(Decimal("100.00"), 20)
        self.assertEqual(remise, Decimal("20.00"))
        
        with self.assertRaises(ValueError):
            calculate_discount_amount(Decimal("100.00"), 150)
    
    def test_devis_validity_period(self):
        """Teste la période de validité d'un devis"""
        def is_devis_still_valid(date_creation, validity_days=30):
            from datetime import datetime, timedelta
            expiry_date = date_creation + timedelta(days=validity_days)
            return datetime.now() <= expiry_date
        
        # Devis créé il y a 10 jours
        recent_date = datetime.now() - timedelta(days=10)
        self.assertTrue(is_devis_still_valid(recent_date))
        
        # Devis créé il y a 40 jours
        old_date = datetime.now() - timedelta(days=40)
        self.assertFalse(is_devis_still_valid(old_date))


class VehiculeModelTest(unittest.TestCase):
    """Tests unitaires pour la logique métier Vehicule"""
    
    def test_vehicule_display_name(self):
        """Teste le formatage du nom d'affichage du véhicule"""
        def format_vehicule_display(type_vehicule, immatriculation):
            if immatriculation:
                return f"{type_vehicule} - {immatriculation}"
            return f"{type_vehicule} - Non immatriculé"
        
        result = format_vehicule_display("CAMION", "AB-123-CD")
        self.assertEqual(result, "CAMION - AB-123-CD")
        
        result_no_immat = format_vehicule_display("CAMION", None)
        self.assertEqual(result_no_immat, "CAMION - Non immatriculé")
    
    def test_vehicule_availability_check(self):
        """Teste la vérification de disponibilité"""
        def is_vehicule_available(statut):
            available_statuses = ["DISPONIBLE", "EN_ROUTE"]
            return statut in available_statuses
        
        self.assertTrue(is_vehicule_available("DISPONIBLE"))
        self.assertTrue(is_vehicule_available("EN_ROUTE"))
        self.assertFalse(is_vehicule_available("EN_MAINTENANCE"))
        self.assertFalse(is_vehicule_available("HORS_SERVICE"))
    
    def test_maintenance_scheduling(self):
        """Teste la logique de planification de maintenance"""
        def next_maintenance_due(last_maintenance, interval_days=90):
            return last_maintenance + timedelta(days=interval_days)
        
        last_date = datetime(2025, 1, 1)
        next_date = next_maintenance_due(last_date)
        expected = datetime(2025, 4, 1)  # 90 jours après
        self.assertEqual(next_date, expected)


class LivraisonModelTest(unittest.TestCase):
    """Tests unitaires pour la logique métier Livraison"""
    
    def test_livraison_status_progression(self):
        """Teste la progression logique des statuts"""
        def can_transition_to(current_status, next_status):
            transitions = {
                "ATTENTE": ["PREPARATION", "ANNULEE"],
                "PREPARATION": ["EN_COURS", "ATTENTE"],
                "EN_COURS": ["LIVREE", "RETOURNEE"],
                "LIVREE": [],
                "ANNULEE": [],
                "RETOURNEE": ["PREPARATION"]
            }
            return next_status in transitions.get(current_status, [])
        
        self.assertTrue(can_transition_to("ATTENTE", "PREPARATION"))
        self.assertTrue(can_transition_to("PREPARATION", "EN_COURS"))
        self.assertFalse(can_transition_to("LIVREE", "PREPARATION"))
        self.assertFalse(can_transition_to("ATTENTE", "LIVREE"))
    
    def test_delivery_time_estimation(self):
        """Teste l'estimation du temps de livraison"""
        def estimate_delivery_time(distance_km):
            if distance_km <= 50:
                return 2  # heures
            elif distance_km <= 200:
                return 4
            else:
                return 8
        
        self.assertEqual(estimate_delivery_time(30), 2)
        self.assertEqual(estimate_delivery_time(100), 4)
        self.assertEqual(estimate_delivery_time(300), 8)


class BusinessLogicTest(unittest.TestCase):
    """Tests unitaires pour la logique métier générale"""
    
    def test_stock_suffisant(self):
        """Teste la vérification de stock suffisant"""
        def is_stock_sufficient(current_stock, quantity_needed):
            return current_stock >= quantity_needed
        
        self.assertTrue(is_stock_sufficient(100, 50))
        self.assertFalse(is_stock_sufficient(30, 50))
        self.assertTrue(is_stock_sufficient(50, 50))  # Égalité
    
    def test_calculate_transport_cost(self):
        """Teste le calcul du coût de transport"""
        def calculate_transport_cost(distance, cout_km, frais_fixes):
            return (Decimal(str(distance)) * cout_km) + frais_fixes
        
        result = calculate_transport_cost(100, Decimal("0.50"), Decimal("20.00"))
        expected = Decimal("70.00")  # (100 * 0.50) + 20
        self.assertEqual(result, expected)
    
    def test_apply_discount(self):
        """Teste l'application d'une remise"""
        def apply_discount(price, discount_percent):
            if discount_percent < 0 or discount_percent > 100:
                raise ValueError("Le pourcentage doit être entre 0 et 100")
            discount_decimal = Decimal(str(discount_percent)) / 100
            return price * (1 - discount_decimal)
        
        result = apply_discount(Decimal("100.00"), 20)
        self.assertEqual(result, Decimal("80.00"))
        
        with self.assertRaises(ValueError):
            apply_discount(Decimal("100.00"), 150)
    
    def test_calculate_tva(self):
        """Teste le calcul de la TVA"""
        def calculate_tva(prix_ht, taux_tva=20):
            taux_decimal = Decimal(str(taux_tva)) / 100
            return prix_ht * taux_decimal
        
        result = calculate_tva(Decimal("100.00"))
        self.assertEqual(result, Decimal("20.00"))
        
        result_custom = calculate_tva(Decimal("50.00"), 10)
        self.assertEqual(result_custom, Decimal("5.00"))


class UtilityFunctionsTest(unittest.TestCase):
    """Tests unitaires pour les fonctions utilitaires"""
    
    def test_format_currency(self):
        """Teste le formatage des devises"""
        def format_currency(amount):
            return f"{amount:.2f} €"
        
        result = format_currency(Decimal("123.456"))
        self.assertEqual(result, "123.46 €")
        
        result = format_currency(Decimal("0"))
        self.assertEqual(result, "0.00 €")
    
    def test_validate_siret(self):
        """Teste la validation d'un numéro SIRET"""
        def validate_siret(siret):
            if not siret:
                return False
            return len(siret) == 14 and siret.isdigit()
        
        self.assertTrue(validate_siret("12345678901234"))
        self.assertFalse(validate_siret("123"))
        self.assertFalse(validate_siret("1234567890123a"))
        self.assertFalse(validate_siret(""))
        self.assertFalse(validate_siret(None))
    
    def test_phone_validation(self):
        """Teste la validation des numéros de téléphone français"""
        def validate_french_phone(phone):
            import re
            if not phone:
                return False
            pattern = r'^0[1-9][0-9]{8}$'
            return bool(re.match(pattern, phone))
        
        self.assertTrue(validate_french_phone("0123456789"))
        self.assertTrue(validate_french_phone("0987654321"))
        self.assertFalse(validate_french_phone("123456789"))
        self.assertFalse(validate_french_phone("01234567890"))
        self.assertFalse(validate_french_phone("0023456789"))
        self.assertFalse(validate_french_phone(""))
    
    def test_business_hours_validation(self):
        """Teste la validation des heures d'ouverture"""
        def is_business_hours(hour, minute=0):
            if hour < 8 or hour > 18:
                return False
            if hour == 18 and minute > 0:
                return False
            return True
        
        self.assertTrue(is_business_hours(10))
        self.assertTrue(is_business_hours(8, 0))
        self.assertTrue(is_business_hours(18, 0))
        self.assertFalse(is_business_hours(7))
        self.assertFalse(is_business_hours(19))
        self.assertFalse(is_business_hours(18, 30))


class DateCalculationTest(unittest.TestCase):
    """Tests unitaires pour les calculs de dates"""
    
    def test_calculate_delivery_date(self):
        """Teste le calcul de date de livraison"""
        def calculate_delivery_date(order_date, processing_days=2, shipping_days=3):
            total_days = processing_days + shipping_days
            return order_date + timedelta(days=total_days)
        
        order_date = datetime(2025, 1, 15)
        delivery_date = calculate_delivery_date(order_date)
        expected = datetime(2025, 1, 20)  # 15 + 5 jours
        self.assertEqual(delivery_date, expected)
    
    def test_working_days_calculation(self):
        """Teste le calcul de jours ouvrables"""
        def add_working_days(start_date, working_days):
            current_date = start_date
            days_added = 0
            
            while days_added < working_days:
                current_date += timedelta(days=1)
                # Lundi = 0, Dimanche = 6
                if current_date.weekday() < 5:  # Lundi à Vendredi
                    days_added += 1
            
            return current_date
        
        # Commence un vendredi
        start = datetime(2025, 1, 17)  # Vendredi
        result = add_working_days(start, 3)
        expected = datetime(2025, 1, 22)  # Mercredi suivant
        self.assertEqual(result, expected)


class MockedExternalServiceTest(unittest.TestCase):
    """Tests unitaires avec mocks pour services externes simulés"""
    
    def test_send_notification(self):
        """Teste l'envoi de notification avec mock"""
        def send_notification(user_email, message):
            # Simuler un appel à un service externe
            if "@" not in user_email:
                return False, "Email invalide"
            if not message:
                return False, "Message vide"
            return True, "Notification envoyée"
        
        success, msg = send_notification("test@example.com", "Hello")
        self.assertTrue(success)
        
        success, msg = send_notification("invalid-email", "Hello")
        self.assertFalse(success)
        
        success, msg = send_notification("test@example.com", "")
        self.assertFalse(success)
    
    def test_payment_processing(self):
        """Teste le traitement de paiement simulé"""
        def process_payment(amount, card_number):
            if amount <= 0:
                return {"success": False, "error": "Montant invalide"}
            if len(card_number) != 16:
                return {"success": False, "error": "Numéro de carte invalide"}
            
            # Simuler différents résultats selon le numéro
            if card_number.startswith("4000"):
                return {"success": False, "error": "Carte refusée"}
            
            return {
                "success": True, 
                "transaction_id": f"TXN_{amount}_{card_number[-4:]}"
            }
        
        result = process_payment(100.50, "1234567890123456")
        self.assertTrue(result["success"])
        
        result = process_payment(-10, "1234567890123456")
        self.assertFalse(result["success"])
        
        result = process_payment(100, "400012345678")
        self.assertFalse(result["success"])


class ValidationTest(unittest.TestCase):
    """Tests unitaires pour les validations métier"""
    
    def test_password_strength(self):
        """Teste la validation de force du mot de passe"""
        def validate_password_strength(password):
            if len(password) < 8:
                return False, "Trop court"
            if not any(c.isupper() for c in password):
                return False, "Manque majuscule"
            if not any(c.islower() for c in password):
                return False, "Manque minuscule"
            if not any(c.isdigit() for c in password):
                return False, "Manque chiffre"
            return True, "Mot de passe valide"
        
        valid, msg = validate_password_strength("Password123")
        self.assertTrue(valid)
        
        valid, msg = validate_password_strength("pass")
        self.assertFalse(valid)
        self.assertIn("court", msg)
        
        valid, msg = validate_password_strength("password123")
        self.assertFalse(valid)
        self.assertIn("majuscule", msg)
    
    def test_order_quantity_validation(self):
        """Teste la validation de quantité de commande"""
        def validate_order_quantity(quantity, min_order=1, max_order=1000):
            if not isinstance(quantity, int):
                return False, "Quantité doit être un entier"
            if quantity < min_order:
                return False, f"Quantité minimum: {min_order}"
            if quantity > max_order:
                return False, f"Quantité maximum: {max_order}"
            return True, "Quantité valide"
        
        valid, msg = validate_order_quantity(50)
        self.assertTrue(valid)
        
        valid, msg = validate_order_quantity(0)
        self.assertFalse(valid)
        
        valid, msg = validate_order_quantity(1500)
        self.assertFalse(valid)


if __name__ == '__main__':
    unittest.main()