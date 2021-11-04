import json
import pandas as pd
import pprint
ppx = pprint.PrettyPrinter(indent=4)

json_string = """
{
    "url": "yolo.szaroletta.de/detected_images/2021-10-06-12-37-12.jpg",
    "filename": "2021-10-06-12-37-12.jpg",
    "predictions": [
        {
            "xmin": 1171.6329345703125,
            "ymin": 1896.09130859375,
            "xmax": 2228.357421875,
            "ymax": 2482.156005859375,
            "confidence": 0.8908808827400208,
            "class": 2,
            "name": "car"
        },
        {
            "xmin": 53.13473892211914,
            "ymin": 1754.961669921875,
            "xmax": 1155.8197021484375,
            "ymax": 2271.37353515625,
            "confidence": 0.8615972995758057,
            "class": 2,
            "name": "car"
        },
        {
            "xmin": 2399.438232421875,
            "ymin": 2038.2926025390625,
            "xmax": 3809.32763671875,
            "ymax": 2759.615966796875,
            "confidence": 0.8573348522186279,
            "class": 2,
            "name": "car"
        },
        {
            "xmin": 3084.914306640625,
            "ymin": 1397.785888671875,
            "xmax": 3833.41650390625,
            "ymax": 1728.9368896484375,
            "confidence": 0.8550239205360413,
            "class": 2,
            "name": "car"
        },
        {
            "xmin": 695.0297241210938,
            "ymin": 1198.9510498046875,
            "xmax": 1279.2213134765625,
            "ymax": 1466.015380859375,
            "confidence": 0.83271723985672,
            "class": 2,
            "name": "car"
        },
        {
            "xmin": 1321.78955078125,
            "ymin": 1213.8470458984375,
            "xmax": 2011.0687255859375,
            "ymax": 1552.999755859375,
            "confidence": 0.8161453008651733,
            "class": 2,
            "name": "car"
        },
        {
            "xmin": 2056.03125,
            "ymin": 1210.6376953125,
            "xmax": 2912.961181640625,
            "ymax": 1643.69580078125,
            "confidence": 0.7568334341049194,
            "class": 2,
            "name": "car"
        },
        {
            "xmin": 3979.0654296875,
            "ymin": 1513.63525390625,
            "xmax": 4160.0,
            "ymax": 1760.412353515625,
            "confidence": 0.6549441814422607,
            "class": 2,
            "name": "car"
        },
        {
            "xmin": 6.8418803215026855,
            "ymin": 1180.7974853515625,
            "xmax": 573.0062866210938,
            "ymax": 1405.5562744140625,
            "confidence": 0.5369510650634766,
            "class": 2,
            "name": "car"
        },
        {
            "xmin": 2.2999343872070312,
            "ymin": 1730.4022216796875,
            "xmax": 156.2626953125,
            "ymax": 2028.751953125,
            "confidence": 0.4964606463909149,
            "class": 7,
            "name": "truck"
        },
        {
            "xmin": 2062.070556640625,
            "ymin": 1216.947998046875,
            "xmax": 2900.27099609375,
            "ymax": 1645.9410400390625,
            "confidence": 0.42261803150177,
            "class": 7,
            "name": "truck"
        }
    ]
}
"""
data = json.loads(json_string)

dummy8 = 9

for a in data['predictions']:
    print(a['name'] + '  ' + str(a['confidence']))

b = data['predictions']
df = pd.DataFrame.from_dict(data['predictions'])
print(df)

print('Count of classes')
class_df = df.value_counts('name')

class_dict = class_df.to_dict()
print(class_dict)

print(class_df.to_json())
print("Flashes:", ppx.pformat(data))
