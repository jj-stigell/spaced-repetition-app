import json
import os

"""
This script will check all translation files for frontend to make sure they have the same keys.
This is to ensure that all translation files are consistent and that no keys are missing.
"""

def get_keys_from_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return set(data.keys())

def main():
    # Adjust this path to where your translation files are located
    path = 'assets/translations'
    files = [f for f in os.listdir(path) if f.endswith('.json')]
    all_keys = []

    # Get keys from each file
    for file in files:
        all_keys.append((file, get_keys_from_file(os.path.join(path, file))))

    # Compare keys
    base_file, base_keys = all_keys[0]
    for file, keys in all_keys[1:]:
        if keys != base_keys:
            diff = keys.symmetric_difference(base_keys)
            print(f"Keys mismatch between {base_file} and {file}. Difference: {diff}")
            exit(1)

    print("All translation files have consistent keys!")

if __name__ == "__main__":
    main()