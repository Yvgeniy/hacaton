import pandas as pd
def lst_polygon (lst):
    # поиск POLYGON((
    active_fire = lst
    polygon = active_fire[active_fire.rfind('(') + 1: active_fire.find('))')]
    polygon_lst = polygon.split(',')

    # сбор списка
    result_polygon = []

    # цикл для обработки
    for plg in polygon_lst:
        lst_polygon = plg.split(' ')
        if len(lst_polygon) != 1:
            try:
                result_polygon.append([float(idx) for idx in reversed(lst_polygon)])
            except ValueError:
                print()

    # обработка массива
    coordx = result_polygon[0][0]
    coordy = result_polygon[0][1]
    i = 0
    for coord_x, coord_y in result_polygon:
        if abs(coord_x - coordx) > 5 or abs(coord_y - coordy) > 5:
            result_polygon.pop(i)
        i += 1

    # начало полигона
    lst_polygon_start = result_polygon[0]
    # конец полигона
    lst_polygon_end = result_polygon[-1]
    # добавляем конечную точку в начало
    if lst_polygon_end != lst_polygon_start:
        result_polygon.append(lst_polygon_start)


    return result_polygon

def Polygon_date(date):
    # библиотеки
    from simpledbf import Dbf5
    import pandas as pd
    from datetime import datetime, timedelta

    # подключаем базу
    dbf = Dbf5('fires4.dbf')
    df = dbf.to_dataframe()

    yesterday = str((datetime.strptime(date, "%Y-%m-%d") - timedelta(days = 1)).date())
    df_result = pd.DataFrame(columns = ['id', 'polygon', 'ignition_day', 'num_days', 'fire_area', 'increase'])

    # поиск по дате
    result_fireid = df[df['dt'] == date]['fireid'].tolist()
    result_active_fir = df[df['dt'] == date]['active_fir'].tolist()
    result_ignition_d = df[df['dt'] == date]['ignition_d'].tolist()

    # количество дней для пожара:
    day_list = []
    for day in result_ignition_d:
        day_list.append((datetime.strptime(date, "%Y-%m-%d") - datetime.strptime(day, "%Y-%m-%d")).days)

    # формирование списка
    refund, n = [], 0
    for active_fire in result_active_fir:
        result_polygon = lst_polygon(active_fire)

        # площадь полигона
        from area import area
        obj = {'type': 'Polygon', 'coordinates': [result_polygon]}
        fire_area_float = area(obj)
        if abs(fire_area_float) > 1e6:
            fire_area = str(round(fire_area_float / 1e6, 3)) + ' км²'
        else:
            fire_area = str(round(fire_area_float, 3)) + ' м²'


        # прирост площади пожара
        increase = 0.0
        poligon_yesterday = df.loc[(df['dt'] == yesterday) & (df['fireid'] == result_fireid[n])]['active_fir'].tolist()
        if len(poligon_yesterday) != 0:
            obj_inc = {'type': 'Polygon', 'coordinates': [lst_polygon(poligon_yesterday[0])]}
            increase_float = fire_area_float - area(obj_inc)
            if abs(increase_float) > 1e6:
                increase = str(round(increase_float / 1e6, 3)) + ' км²'
            else:
                increase = str(round(increase_float, 3)) + ' м²'

        # итоговый массив
        df_result.loc[n, 'id'] = result_fireid[n]
        df_result.loc[n, 'polygon'] = result_polygon
        df_result.loc[n, 'ignition_day'] = result_ignition_d[n]
        df_result.loc[n, 'num_days'] = day_list[n]
        df_result.loc[n, 'fire_area'] = fire_area
        df_result.loc[n, 'increase'] = increase

        n += 1

    return df_result
df = Polygon_date('2012-03-23')
df.to_csv('out.csv', sep=';')
