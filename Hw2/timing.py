from typing import List

def calculate_and_print_average_times(fast_times: List[float], fastr_times: List[float]) -> None:
    avg_fast = sum(fast_times) / len(fast_times)
    avg_fastr = sum(fastr_times) / len(fastr_times)
    print(f"\naverage FAST time: {avg_fast:.4f} seconds")
    print(f"average FASTR time: {avg_fastr:.4f} seconds")
