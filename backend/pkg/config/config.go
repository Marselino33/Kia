package config

import (
	"net/url"

	"sejiwa-backend/pkg/database"

	"github.com/spf13/viper"
)

type Config struct {
	ServiceHost            string           `mapstructure:"service_host" json:"service_host"`
	ServiceEndpointV       string           `mapstructure:"service_endpoint_v" json:"service_endpoint_v"`
	ServiceEnvironment     string           `mapstructure:"service_environment" json:"service_environment"`
	ServicePort            string           `mapstructure:"service_port" json:"service_port"`
	MentalHealthServiceURL string           `mapstructure:"mental_health_service_url" json:"mental_health_service_url"`
	JWTSecret              string           `mapstructure:"jwt_secret" json:"jwt_secret"`
	DatabaseURL            string           `mapstructure:"database_url" json:"database_url"`
	Database               DatabasePlatform `mapstructure:"database" json:"database"`
}

func NewConfig() *Config {
	return &Config{
		ServiceHost:            viper.GetString("APP_HOST"),
		ServiceEndpointV:       viper.GetString("APP_ENDPOINT_V"),
		ServiceEnvironment:     viper.GetString("APP_ENVIRONMENT"),
		ServicePort:            viper.GetString("APP_PORT"),
		MentalHealthServiceURL: viper.GetString("MENTAL_HEALTH_SERVICE_URL"),
		JWTSecret:              viper.GetString("JWT_SECRET"),
		DatabaseURL:            viper.GetString("DATABASE_URL"),
		Database:               LoadDatabaseConfig(),
	}
}

func (d *Database) ToArgs(dbType database.DBType, connType database.ConnType, val url.Values) (res *database.Args) {
	res = &database.Args{
		Username:        d.Username,
		Password:        d.Password,
		Host:            d.URL,
		Port:            d.Port,
		Database:        d.Name,
		MaxIdleConns:    d.MaxIdleConns,
		MaxOpenConns:    d.MaxOpenConns,
		ConnMaxLifetime: d.MaxLifetime,
		Flavor:          d.Flavor,
		Location:        d.Location,
		Timeout:         d.Timeout,

		DBType:   dbType,
		ConnType: connType,
		Values:   val,
	}
	return
}
