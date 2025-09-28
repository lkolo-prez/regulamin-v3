#!/usr/bin/env python3

import os
from aircloud_legal_platform import app

def test_template():
    with app.app_context():
        from flask import render_template
        from aircloud_legal_platform import LegalSystem, Document, User
        
        legal_systems = LegalSystem.query.all()
        print(f"Found {len(legal_systems)} legal systems")
        
        try:
            result = render_template('index_test.html', legal_systems=legal_systems)
            print('SUCCESS: Template rendered without errors')
            print('Length of rendered content:', len(result))
        except Exception as e:
            print('ERROR in template rendering:', str(e))
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    test_template()