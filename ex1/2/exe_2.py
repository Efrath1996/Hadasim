import pandas as pd
import os
import pandas as pd


def get_ave_file_by_hour(fileName):
#1 check data
    df = pd.read_csv(f'{fileName}.csv')
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce', dayfirst=True)
    df['value'] = pd.to_numeric(df['value'], errors='coerce')
    print(df[df['value'].isna()]) # nan val

    col_sums_with_nan = df.isna().sum().sum()
    if col_sums_with_nan > 0:
        df.dropna(inplace=True)
    #print(df)


    col_sums_with_dup = df.duplicated().sum()
    if col_sums_with_dup > 0:
        df.drop_duplicates(inplace=True)
    #print(df)

    #2 return ave hour in file 
    output_folder = 'split_csv'
    lines_in_file = 100000
    os.makedirs(output_folder, exist_ok=True)
    for index, i in enumerate(range(0, len(df), lines_in_file), start=1):
        part = df.iloc[i:i+lines_in_file]
        part.to_csv(f'{output_folder}/time_series_{index}.csv')

    all_parts = []
    for filename in os.listdir(output_folder):
        file_path = os.path.join(output_folder, filename)
        part_df = pd.read_csv(file_path)
        part_df['timestamp'] = pd.to_datetime(part_df['timestamp'])
        part_df['datebyhour'] = part_df['timestamp'].dt.floor('h')
        hourly_avg = part_df.groupby('datebyhour')['value'].mean()
        for datebyhour, val in hourly_avg.items():
            all_parts.append({'datebyhour': datebyhour, 'value': val})

    if all_parts:
        all_parts_df = pd.DataFrame(all_parts)
        final_time_series = all_parts_df.groupby('datebyhour')['value'].mean()

        print(final_time_series)
        final_time_series.to_csv('final_time_series.csv')


    #3 return ave hour in data 
    data = [
        {'timestamp': '2025-06-10 06:15:00', 'value': 10.3},
        {'timestamp': '2025-06-10 07:10:00', 'value': 12.1},
        {'timestamp': '2025-06-10 06:45:00', 'value': 7.9},
    ]

    lines = 2  
    all_parts1 = []

    df = pd.DataFrame(data)
    df['timestamp'] = pd.to_datetime(df['timestamp'])

    for i in range(0, len(df), lines):
        part = df.iloc[i:i+lines].copy()
        part['datebyhour'] = part['timestamp'].dt.floor('h')  
        hourly_avg = part.groupby('datebyhour')['value'].mean()
        for datebyhour, val in hourly_avg.items():
            all_parts1.append({'datebyhour': datebyhour, 'value': val})

    combined_df = pd.DataFrame(all_parts1)
    final_all_parts1 = combined_df.groupby('datebyhour')['value'].mean()

    print(final_all_parts1)

#4
    df = pd.read_parquet(f'{fileName}.parquet')
    print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    print(df)
    print('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    print(df[['timestamp', 'mean_value']])
    
#פרקט תומך בדחיסה יעילה של נתונים, מה שמפחית את נפח האחסון הנדרש ומגדיל את מהירות העבודה.

#main
fileName = 'time_series'
get_ave_file_by_hour(fileName)