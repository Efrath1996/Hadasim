import pandas as pd
import os

def get_ave_file_by_hour(fileName):
#1 Check data
    print("ex 1")
    df = pd.read_csv(f'{fileName}.csv')
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce', dayfirst=True)
    df['value'] = pd.to_numeric(df['value'], errors='coerce')
    if df.isna().sum().sum() > 0:
        df.dropna(inplace=True)
    if df.duplicated().sum() > 0:
        df.drop_duplicates(inplace=True)

#2 Calculate hourly averages
    print("ex 2")
    df['datebyhour'] = df['timestamp'].dt.floor('h')
    avg_all = df.groupby('datebyhour')['value'].mean()
    print(avg_all)

#3 Split file by day, calculate hourly averages per file, and merge
    print("ex 3")
    df['date_only'] = df['timestamp'].dt.date
    os.makedirs('split_csv', exist_ok=True)
    for d in df['date_only'].unique():
        day_data = df[df['date_only'] == d].drop(columns=['date_only', 'datebyhour'])
        day_data.to_csv(f'split_csv/time_series_{d}.csv', index=False)

    all_avgs = []
    for file in os.listdir('split_csv'):
        part = pd.read_csv(os.path.join('split_csv', file))
        part['timestamp'] = pd.to_datetime(part['timestamp'])
        part['datebyhour'] = part['timestamp'].dt.floor('h')
        avg_part = part.groupby('datebyhour')['value'].mean()
        for idx, val in avg_part.items():
            all_avgs.append({'datebyhour': idx, 'value': val})

    all_avgs_df = pd.DataFrame(all_avgs)
    final_avg = all_avgs_df.groupby('datebyhour')['value'].mean()
    print(final_avg)
    final_avg.to_csv('final_time_series.csv')

#4 Streaming data
    print("ex 4")
    hourly_sums = {}
    hourly_counts = {}
    hourly_averages = {}

    streaming_data = [
        {'timestamp': '2025-06-10 06:15:00', 'value': 10.3},
        {'timestamp': '2025-06-10 07:10:00', 'value': 12.1},
        {'timestamp': '2025-06-10 06:45:00', 'value': 7.9},
    ]

    for record in streaming_data:
        hour = pd.to_datetime(record['timestamp']).floor('h')
        val = record['value']
        if hour not in hourly_sums:
            hourly_sums[hour] = 0
            hourly_counts[hour] = 0
        hourly_sums[hour] += val
        hourly_counts[hour] += 1
        avg = hourly_sums[hour] / hourly_counts[hour]
        hourly_averages[hour] = avg
        print(f"{hour}: {avg}")
    
    for hour, avg in hourly_averages.items():
        print(f"{hour}: {avg}")
        

#5 Parquet file
    print("ex 5")
    df_parquet = pd.read_parquet(f'{fileName}.parquet')
    df_selected = df_parquet[['timestamp', 'mean_value']]
    print(df_selected.head())

get_ave_file_by_hour('time_series')
