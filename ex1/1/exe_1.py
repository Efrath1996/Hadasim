import os

#1
def split_log_file(input_file, lines_in_file=100000, folder='split_logs'):
    file_count = 0
    line_count = 0
    output_file = None
    os.makedirs(folder, exist_ok=True) 
    with open(input_file, 'r', encoding='utf-8') as rf:
        for line in rf:
            if line_count % lines_in_file == 0:
                if output_file: 
                    output_file.close()
                file_count += 1
                output_file = open(os.path.join(folder, f'log_part_{file_count}.txt'), 'w', encoding='utf-8')
            output_file.write(line)
            line_count += 1
    if output_file:
        output_file.close()



#2
def get_errors_count_for_file(folder_path):
    file_names = sorted([f for f in os.listdir(folder_path)])
    #print(file_names)
    index = 1 
    all_counts = {} 
    for file_name in file_names:
        error_counts = {} 
        with open(os.path.join(folder_path, file_name), 'r', encoding='utf-8') as file:
            for line in file:
                parts = line.split('Error:')
                code = parts[1]
                if code in error_counts:
                    error_counts[code] += 1
                else:
                    error_counts[code] = 1
        all_counts[f'error_counts_{index}'] = error_counts
        index += 1 
   
    #for key, value in all_counts.items():
        #print(f'{key}: {value}')
    return all_counts


#3
def get_errors_count_for_folder(all_counts):
    main_error_counts = {}
    for key, value in all_counts.items():
        for code in value:
            if code in main_error_counts:
                main_error_counts[code] += value[code]
            else:
                main_error_counts[code] = value[code]  
    
    #print(main_error_counts)
    return main_error_counts


#4
def get_top_n_errors_counts(main_error_counts, n):
    sorted_main_error_counts = dict(sorted(main_error_counts.items(), key=lambda item: item[1], reverse=True)) #item[1] = val
    #print(sorted_main_error_counts)
    top_n = list(sorted_main_error_counts.items())[:n]
    return top_n


#5
#nlogn+n

#main
def get_top_n_errors_and_counts_from_file(file ,n):
   
   lines_in_file=100000
   split_files_folder = 'split_logs'

   split_log_file(file, lines_in_file, split_files_folder) 
   all_counts = get_errors_count_for_file(split_files_folder)
   main_error_counts = get_errors_count_for_folder(all_counts)
   top_n_errors_counts = get_top_n_errors_counts(main_error_counts, n)
   return top_n_errors_counts
   

top_n = get_top_n_errors_and_counts_from_file('logs.txt', n=3)
print(top_n)