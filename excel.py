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
                    result_polygon.append([float(idx) for idx in  reversed(lst_polygon)])
                except ValueError:
                    print()
        # итоговый массив
        refund.append(result_polygon)
    return refund

print(Polygon_date('2012-03-23'))



