#!/usr/bin/env python3
# Test script to check LegalSystem model

from aircloud_legal_platform import app, db, LegalSystem

def test_legal_system_model():
    with app.app_context():
        systems = LegalSystem.query.all()
        print(f"Found {len(systems)} legal systems")
        
        for system in systems:
            print(f"System: {system.name}")
            print(f"  ID: {system.id}")
            print(f"  system_type: {getattr(system, 'system_type', 'NOT FOUND')}")
            print(f"  Has system_type attr: {hasattr(system, 'system_type')}")
            print(f"  Has type attr: {hasattr(system, 'type')}")
            print(f"  All attributes: {[attr for attr in dir(system) if not attr.startswith('_')]}")
            print("---")

if __name__ == "__main__":
    test_legal_system_model()