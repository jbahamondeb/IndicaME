# IndicaME
## Plataforma web para la administración de indicadores a nivel nacional

[![N|Solid](https://uploads-ssl.webflow.com/5d8125bcaf917cc3a7c46317/5dada966529b5a380bac7754_Logo%20Primary.svg)Powered by Akveo](https://akveo.page.link/8V2f)

El Centro de Información para la Democracia (Demodata), generó a través de una asesoría solicitada por el Gobierno Regional de la Araucanía, una serie de indicadores estadísticos producidos a partir de Datos Abiertos, asegurando a través de una serie de factores, la representatividad de estos indicadores en una zona en particular. Todo este proceso fue llevado a cabo de forma manual, lo cual conllevó un proceso exhaustivo y poco replicable.

 A pesar de todo el trabajo y los datos generados por Demodata, aún no existe un sistema capaz de desplegar toda esta información de una forma clara, resumida y rápida para el usuario. Es por esto mismo que se propone el desarrollo de una plataforma web capaz de administrar estos indicadores, permitiendo a personas conocedoras del área, alimentar el sistema con indicadores, y además realizar búsquedas y visualizaciones interactivas de gráficos y mapas representativos de estos mismos.

Gran parte del proceso de la creación de esta plataforma, requirió entre otras cosas, un manejo avanzado de Sistemas de Información Geográfica (GIS), que permita al usuario visualizar mapas interactivos y mapas coropléticos, apoyando así a la toma de decisiones por parte de los gobiernos.

## Tecnologías utilizadas
IndicaME utiliza varias tecnologías de código abierto para funcionar correctamente:

- NodeJS 10.19.0
- Angular 11.0.7
- Geoserver 2.19.1
- PostgreSQL 12.7
- Extensiones PostgreSQL
    - [pgCrypto][pg-crypto]
    - [PostGIS][postgis]
    - [similarity][similarity]
    - [cartodb][cartodb]
## Instalación Local

IndicaME requiere [Node.js](https://nodejs.org/) v10+ para funcionar.

Este proyecto solo fue probado en una máquina con Linux Mint 20.1, pero no debería haber ningún problema mientras sea una máquina que permita realizar:

```
make install
```

#### Instalar Angular v10+ (en caso de no tenerlo) de la siguiente forma:

```
npm install -g @angular/cli@latest
```
#### Configurar PostgreSQL

1. Asegurarse de tener contrib de PostgreSQL, en caso de no tenerlo ejecutar:

```
sudo apt-get install postgresql-contrib
```
2. Instalar [PostGIS][postgis] al estar conectado en PostgreSQL:

```
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
```

3. Instalar [pgCrypto][pg-crypto] al estar conectado en PostgreSQL:

```
CREATE EXTENSION pgcrypto; 
```

4. Instalar [similarity][similarity] al estar conectado en PostgreSQL:

```
CREATE EXTENSION pg_trgm;
```

3. Instalar [CartoDB][cartodb]. Para esto se debe realizar, dentro del respositorio en donde se instaló CartoDB:

```
make all install
```

4. Crear una Base de Datos al estar conectado en PostgreSQL, la cual debe ser llamada memoria2:
```
CREATE DATABASE memoria2;
```

5. Descargar el archivo [.sql][sql], e importarlo en PostgreSQL con:

```
psql memoria2 < /path/to/sqlfile/memoria2.sql
```

#### Configurar GeoServer



1. Descargar la carpeta [Geoserver][geoserver] y los archivos [.shp][shapefiles]. Una vez hecho esto, ejecutar el siguiente comando, cambiando la ruta de acuerdo al lugar en donde se tiene descargado el directorio geoserver descargado:

```
export GEOSERVER_DATA_DIR=/home/valone/Escritorio/geoserver/data_dir
```
2. Ejecutar los siguientes comandos en la carpeta geoserver:

```
cd bin
sh startup.sh
```

3. Ingresar a la url de Geoserver http://localhost:8080/geoserver/web/ con las credenciales por defecto 
user: admin, pass: geoserver.

4. Seguir los siguientes pasos:

   1. Seleccionar Almacenes de datos
   
      ![Paso 1](https://i.imgur.com/hP25gzG.png)
   2. Seleccionar alguna de las capas descargadas, este procedimiento se debe realizar con ProvincialCoordenadas, RegionalCoordenadas y comunasCoordenadas.  
   
      ![Paso 2](https://i.imgur.com/Gu9rqcE.png)
   3. Cambiar la ruta de acuerdo al repositorio en donde están sus archivos .shp descargados y guardar los cambios.  
   
      ![Paso 3](https://i.imgur.com/IZ4c0V0.png)
   4. Cambiar parámetros de conexión en capa "database". Estos son de acuerdo a como se tiene configurado PostgreSQL.  
   
       ![Paso 4](https://i.imgur.com/6jczbt7.png)
       ![Paso 5](https://i.imgur.com/Qwz2cVD.png)

## Puesta en marcha.

Para poner en marcha el proyecto de forma local, se deben ejecutar los siguientes comandos:

1. Obtener repositorio de GIT
```
git clone https://github.com/jbahamondeb/IndicaME.git
```

2. En el repositorio en donde se tiene almacenado GeoServer, ejecutar los siguientes comandos:

```
cd bin
sh startup.sh
```

3. En el repositorio clonado y en otra terminal, ejecutar los siguientes comandos para poner en marcha NodeJS:

```
cd Backend
npm install
node server.js
```

4. En el respositorio clonado y en otra terminal, ejecutar los siguientes comandos para poner en marcha Angular:
```
npm install
npm start
```

# Contacto

En caso de cualquier duda y/o error, contactar con joaquinbah2016@udec.cl o joaquin.bahamonde.b@gmail.com.



   [pg-crypto]: <https://www.postgresql.org/docs/9.4/pgcrypto.html>
   [postgis]: <https://postgis.net/install/>
   [similarity]: <https://github.com/urbic/postgresql-similarity>
   [cartodb]: <https://github.com/CartoDB/cartodb-postgresql>
   [sql]: <https://drive.google.com/file/d/1_FW5F4aq299EvVyQ1Gx1FYKvqsH9BfKl/view?usp=sharing>
   [geoserver]: <https://drive.google.com/drive/folders/1wn5PCPHcHd7QGIOaA3ntPiBghT9IZtMN?usp=sharing>
   [shapefiles]: <https://drive.google.com/drive/folders/1guAGg-1GKAFNTJC3KRPJL3R0HptXgWp4?usp=sharing>



