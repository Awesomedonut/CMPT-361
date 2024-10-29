from typing import List

def calculate_and_print_average_times(fast_times: List[float], fastr_times: List[float]) -> None:
    avg_fast = sum(fast_times) / len(fast_times)
    avg_fastr = sum(fastr_times) / len(fastr_times)
    print(f"\naverage FAST time: {avg_fast:.4f} seconds")
    print(f"average FASTR time: {avg_fastr:.4f} seconds")

def print_matching_times(
    fast_desc_times: List[float],
    fast_match_times: List[float],
    fastr_desc_times: List[float],
    fastr_match_times: List[float]
) -> None:
    print("\navg timing:")
    print(f"FAST descriptor generation: {sum(fast_desc_times)/len(fast_desc_times):.4f} seconds")
    print(f"FAST matching: {sum(fast_match_times)/len(fast_match_times):.4f} seconds")
    print(f"FASTR descriptor generation: {sum(fastr_desc_times)/len(fastr_desc_times):.4f} seconds")
    print(f"FASTR matching: {sum(fastr_match_times)/len(fastr_match_times):.4f} seconds")
