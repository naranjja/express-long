import pandas as pd
import sys
args = sys.argv[1:]

df = pd.DataFrame()
for i, arg in enumerate(args):
    if i == 0:
        print(2)
print({
    "x": 500,
    "y": 500
})