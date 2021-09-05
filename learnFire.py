import pandas as pd
from simpledbf import Dbf5
from excel_v2 import Polygon_date
from sktime.classification.interval_based import TimeSeriesForestClassifier
import numpy as np
dbf = Dbf5('fires.dbf')
df = dbf.to_dataframe()
df_result = pd.DataFrame(columns=['dt', 'polygon', 'ignition_day', 'num_days', 'fire_area', 'increase'])

# print(df.dt.unique())
# for date in df.dt.unique():
#     df_result  = pd.concat([df_result , Polygon_date(date)], ignore_index= True)

print(df_result)
classifier = TimeSeriesForestClassifier()
X = Polygon_date('2012-03-23')
Y = X['fire_area']
X.pop('id')
X.pop('fire_area')
X.pop('polygon')
X_t = pd.DataFrame(X.apply(lambda x: np.array(x), axis = 1))
Z = Y.astype(float)
print(X_t)
classifier.fit(X_t,Y.astype(float))
#
#
# y_p = classifier.predict(X_t)