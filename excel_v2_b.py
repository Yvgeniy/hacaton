def Polygon_date(date):
    # библиотеки
    from simpledbf import Dbf5
    # подключаем базу
    dbf = Dbf5('fires.dbf')
    df = dbf.to_dataframe()
    # поиск по дате
    result_found = df[df['dt'] == date]['active_fir'].tolist()
    # формирование списка
    refund = []
    for active_fire in result_found:
        # поиск POLYGON((
        polygon = active_fire[active_fire.rfind('(') + 1 : active_fire.find('))')]
        polygon_lst = polygon.split(',')
        # сбор списка
        result_polygon = []
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
                print(coord_y, ' - ',  coord_x)
            i += 1

        # итоговый массив
        refund.append(result_polygon)
    return refund

# print(Polygon_date('2012-03-23'))