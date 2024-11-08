import csv
import json

rows_processed = 0
bad_rows = 0
with open('assets/clean_data_set.csv', newline='') as csv_file:
    csv_data = csv.reader(csv_file)
    next(csv_data, None)
    with open('assets/better-merged.json') as json_file:
        json_data = json.load(json_file)
        town_data = json_data['objects']['JPN_adm3']['geometries']
        for csv_row, json_row in zip(csv_data, town_data):
            csv_row_id = int(csv_row[0])
            props = json_row['properties']
            json_row_id = props['ID_2']
            assert (csv_row_id == json_row_id)
            if csv_row[6] != props['NAME_2'] or csv_row[9] != props['TYPE_2']:
                print(f'csv: {csv_row}\njson: {props}\n')
                bad_rows += 1
print(f'{rows_processed} rows seen. {bad_rows} are not matching')
