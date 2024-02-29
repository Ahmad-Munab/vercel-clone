package cmd

import (
	"ahmadmunab/vc-api-server/config"
	"ahmadmunab/vc-api-server/database"
	"ahmadmunab/vc-api-server/repo"
	"ahmadmunab/vc-api-server/rest"
	"ahmadmunab/vc-api-server/svc"
	"fmt"
)

func serveRest() {
	appConfig := config.GetApp()
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", appConfig.DBUser, appConfig.DBPass, appConfig.DBHost, appConfig.DBPort, appConfig.DBName)
	db := database.NewDatabase(dsn)
	stdRepo := repo.NewStudentRepo(db)
	svc := svc.NewService(stdRepo)

	server, err := rest.NewServer(svc, appConfig)

	if err != nil {
		panic(err)
	}

	err = server.Start()

	if err != nil {
		panic(err)
	}
}
