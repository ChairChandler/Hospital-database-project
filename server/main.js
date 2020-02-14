const MYSQL_DBMS = require('./mysql-dbms').MYSQL_DBMS
const http = require('http')
const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'Accept,Content-Type',
    'Access-Control-Allow-Credentials': 'true'
}

/* Client JSON
 * {
 *      operation: string,
 *      data: object
 * } 
 */

http.createServer((req, res) => {
    const data = []
    
    req.on('data', chunk => {
        data.push(chunk)
    });
    req.on('end', () => {
        try{
            const client = JSON.parse(data.toString())
            res.writeHead(200, headers)
            selectOperation(client, res)
        }catch(err) {
            console.log(err)
            res.writeHead(400, headers)
            res.end(JSON.stringify({
                error: err.message
            }))
        }
    })
}).listen(1234, '127.0.0.1')


function selectOperation(client, res) {
    const data = client.data
    switch(client.operation.toLowerCase()) {
        case 'login':
            login(data, res)
        break

        case 'show users':
            showUsers(data, res)
        break

        case 'show types':
            showTypes(data, res)
        break

        case 'delete users':
            deleteUsers(data, res)
        break

        case 'add user':
            addUser(data, res)
        break

        case 'add patient':
            addPatient(data, res)
        break

        case 'edit user':
            editUser(data, res)
        break

        case 'edit patient':
            editPatient(data, res)
        break

        case 'show schedule':
            showSchedule(data, res)
        break

        case 'show patients cards':
            showPatientsCards(data, res)
        break

        case 'show pesel':
            showPesel(data, res)
        break

        case 'show treatments schedule':
            showTreatmentsSchedule(data, res)
        break

        case 'show table patients':
            showTablePatients(data, res)
        break

        case 'show treatments services':
            showTreatmentsServices(data, res)
        break

        case 'show assignment doctors':
            showAssignmentDoctors(data, res)
        break

        case 'sign treatment':
            signTreatment(data, res)
        break

        case 'show full time':
            showFullTime(data, res)
        break

        case 'show employee':
            showEmployee(data, res)
        break

        case 'show specializations':
            showSpecializations(data, res)
        break

        case 'show doctor specializations':
            showDoctorSpecializations(data, res)
        break

        case 'add job type':
            addJobType(data, res)
        break

        case 'edit job type':
            editJobType(data, res)
        break

        case 'delete job type':
            deleteJobType(data, res)
        break

        case 'add employee':
            addEmployee(data, res)
        break

        case 'delete employee':
            deleteEmployee(data, res)
        break

        case 'add employee specialization':
            addEmployeeSpecialization(data, res)
        break

        case 'add specialization':
            addSpecialization(data, res)
        break

        case 'edit specialization':
            editSpecialization(data, res)
        break

        case 'delete specialization':
            deleteSpecialization(data, res)
        break

        case 'add treatment type':
            addTreatmentType(data, res)
        break

        case 'delete treatments':
            deleteTreatments(data, res)
        break

        default:
            {
                console.log(client.operation.toLowerCase())
                unrecognisedCommand(res)
            }
    }
}

function deleteUsers(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            for(const val of usr.users) {
                call('procedure', `usunUzytkownika('${val.nazwa}')`, (err, result) => {
                    if(err) {
                        res.end(JSON.stringify({
                            error: parseError(err)
                        }))
                    } else {
                        res.end(JSON.stringify({}))
                    }
                })
            }
        }
    })
}

function signTreatment(usr, res) {
    const today = new Date()
    const visitDate = today
    const endDate = new Date(today.getFullYear() + 20, today.getMonth(), today.getDate())

    const loop = () => {
        databaseAccess(usr, (call, err) => {
            if(err) {
                console.log(3)
                res.end(JSON.stringify({
                    error: parseError(err)
                }))
            } else {
                const parsedDate = visitDate.toISOString().slice(0, 10).replace('T', ' ')
                call('procedure', `zapiszWizyte('${usr.patient.pesel}', '${usr.patient.treatmentType}', '${parsedDate}')`, (err, result) => {
                    if(err) {
                        if(visitDate < endDate) {
                            visitDate.setDate(visitDate.getDate() + 1)
                            loop()
                        } else {
                            res.end(JSON.stringify({
                                error: "Cannot sign a treatment"
                            }))
                        }
                    } else {
                        res.end(JSON.stringify({
                            date: parsedDate
                        }))
                    }
                })
            }
    })}

    loop()
}

function addUser(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `dodajUzytkownika('${usr.user.login}', '${usr.user.password}')`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else {
                    res.end(JSON.stringify({}))
                }
                
                if(usr.user.type) {
                    call('procedure', `zmienTypUzytkownikowi('${usr.user.login}', '${usr.user.type}')`, (err, result) => {
                        if(err) {
                            res.end(JSON.stringify({
                                error: parseError(err)
                            }))
                        } else {
                            res.end(JSON.stringify({}))
                        }
                    })
                }
            })
        }
    })
}

function showFullTime(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `wyswietlEtaty()`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else {
                    res.end(JSON.stringify({
                        headers: [
                            {header: 'nazwa_etatu', label: 'nazwa_etatu', visible: true},
                            {header: 'placa_pod', label: 'placa_pod', visible: true},
                        ],
                        rows: result
                    }))
                }
            })
        }
    })
}

function showEmployee(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `wyswietlPracownikow()`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else {
                    res.end(JSON.stringify({
                        headers: [
                            {header: 'pesel', label: 'pesel', visible: true},
                            {header: 'imie', label: 'imie', visible: true},
                            {header: 'nazwisko', label: 'nazwisko', visible: true},
                            {header: 'etat', label: 'etat', visible: true},
                            {header: 'data_zatrudnienia', label: 'data_zatrudnienia', visible: true},
                            {header: 'zarobki_pod', label: 'zarobki_pod', visible: true},
                            {header: 'zarobki_dod', label: 'zarobki_dod', visible: true},
                        ],
                        rows: result
                    }))
                }
            })
        }
    })
}

function showSpecializations(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `wyswietlSpecjalizacjeLekarskie()`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else {
                    res.end(JSON.stringify({
                        headers: [
                            {header: 'nazwa', label: 'nazwa', visible: true},
                            {header: 'placa', label: 'placa', visible: true},
                        ],
                        rows: result
                    }))
                }
            })
        }
    })
}

function showDoctorSpecializations(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `wyswietlSpecjalizacjeLekarza('${usr.pesel}')`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else {
                    res.end(JSON.stringify({
                        headers: [
                            {header: 'pesel', label: 'pesel', visible: false},
                            {header: 'nazwa_specjalizacji', label: 'nazwa_specjalizacji', visible: true},
                            {header: 'data_uzyskania', label: 'data_uzyskania', visible: true},
                        ],
                        rows: result
                    }))
                }
            })
        }
    })
}

function addPatient(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `dodajPacjenta('${usr.patient.pesel}', '${usr.patient.name}', '${usr.patient.surname}', '${usr.patient.date_of_birth}')`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else {
                    res.end(JSON.stringify({}))
                }
            })
        }
    })
}

function editUser(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `zmienTypUzytkownikowi('${usr.user.login}', '${usr.user.type == null ? 'NULL': usr.user.type}')`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: 'Cannot edit user'
                    }))
                } else {
                    res.end(JSON.stringify({}))
                }
            })

            if(usr.user.password) {
                call('procedure', `zmienHaslo('${usr.user.login}', '${usr.user.password}')`, (err, result) => {
                    if(err) {
                        res.end(JSON.stringify({
                            error: 'Cannot edit user'
                        }))
                    } else {
                        res.end(JSON.stringify({}))
                    }
                })
            }
        }
    })
}

function editPatient(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `aktualizujDaneOsobowe('${usr.patient.pesel}', '${usr.patient.name}', '${usr.patient.surname}', '${usr.patient.date_of_birth}')`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: 'Cannot edit patient'
                    }))
                } else {
                    res.end(JSON.stringify({}))
                }
            })
        }
    })
}

function showTypes(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `wyswietlTypy()`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else {
                    res.end(JSON.stringify({
                        types: result.map(val => val.nazwa)
                    }))
                }
            })
        }
    })
}

function showPesel(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `wyswietlPesel('${usr.login}')`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else {
                    res.end(JSON.stringify({
                        pesel: result[0].pesel
                    }))
                }
            })
        }
    })
}

function addJobType(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `dodajEtat('${usr.job.name}', ${usr.job.payment})`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else {
                    res.end(JSON.stringify({}))
                }
            })
        }
    })
}

function addEmployee(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `dodajPracownika('${usr.employee.user === null ? 'NULL' : usr.employee.user}', '${usr.employee.pesel}', 
            '${usr.employee.name}', '${usr.employee.surname}', '${usr.employee.jobType}', '${usr.employee.date_of_employment}')`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else {
                    call('procedure', `dodajGrafik(
                        '${usr.employee.pesel}',
                        '${usr.employee.monday_work == true ? 'TAK' : 'NIE'}',
                        '${usr.employee.tuesday_work == true ? 'TAK' : 'NIE'}',
                        '${usr.employee.wednesday_work == true ? 'TAK' : 'NIE'}',
                        '${usr.employee.thursday_work == true ? 'TAK' : 'NIE'}',
                        '${usr.employee.friday_work == true ? 'TAK' : 'NIE'}')`, (err, result) => {
                        if(err) {
                            res.end(JSON.stringify({
                                error: parseError(err)
                            }))
                        } else {
                            res.end(JSON.stringify({}))
                        }
                    })
                }
            })
        }
    })
}

function editJobType(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `edytujEtat('${usr.job.prevName}', '${usr.job.name}', ${usr.job.payment})`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else {
                    res.end(JSON.stringify({}))
                }
            })
        }
    })
}

function addTreatmentType(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `wyswietlNastepneIDGrupySpecjalizacji()`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else {
                    for(const val of usr.treatment.specs) {
                        if(val.checked) {
                            call('procedure', `dodajWymaganeSpecjalizacjeDoZabiegu(${result[0].lastID}, '${val.name}')`, (err, result) => {
                                if(err) {
                                    res.end(JSON.stringify({
                                        error: parseError(err)
                                    }))
                                }
                            })
                        }
                    }

                    setTimeout(() => {
                        //const time = usr.treatment.duration.slice(11, 16) + ':00'
                        call('procedure', `dodajTypZabiegu('${usr.treatment.type_name}', ${usr.treatment.price}, '${usr.treatment.duration}', ${result[0].lastID})`, (err, result) => {
                            if(err) {
                                res.end(JSON.stringify({
                                    error: parseError(err)
                                }))
                            } else {
                                res.end(JSON.stringify({}))
                            }
                        })
                    }, 100)
                }
            })
        }
    })
}

function deleteJobType(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            for(const val of usr.jobs) {
                call('procedure', `usunEtat('${val.nazwa_etatu}')`, (err, result) => {
                    if(err) {
                        res.end(JSON.stringify({
                            error: parseError(err)
                        }))
                    } else {
                        res.end(JSON.stringify({}))
                    }
                })
            }
        }
    })
}

function deleteSpecialization(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            for(const val of usr.specializations) {
                call('procedure', `usunSpecjalizacjeLekarska('${val.nazwa}')`, (err, result) => {
                    if(err) {
                        res.end(JSON.stringify({
                            error: parseError(err)
                        }))
                    } else {
                        res.end(JSON.stringify({}))
                    }
                })
            }
        }
    })
}

function deleteTreatments(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            for(const val of usr.treatments) {
                call('procedure', `usunZabieg('${val.typ}')`, (err, result) => {
                    if(err) {
                        res.end(JSON.stringify({
                            error: parseError(err)
                        }))
                    } else {
                        res.end(JSON.stringify({}))
                    }
                })
            }
        }
    })
}

function deleteEmployee(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            for(const val of usr.employees) {
                call('procedure', `usunPracownika('${val.pesel}')`, (err, result) => {
                    if(err) {
                        res.end(JSON.stringify({
                            error: parseError(err)
                        }))
                    } else {
                        res.end(JSON.stringify({}))
                    }
                })
            }
        }
    })
}

function addEmployeeSpecialization(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
                call('procedure', `dodajSpecjalizacjeLekarza('${usr.specialization.pesel}', '${usr.specialization.spec_name}', '${usr.specialization.date_of_gain_spec}')`, (err, result) => {
                    if(err) {
                        res.end(JSON.stringify({
                            error: parseError(err)
                        }))
                    } else {
                        res.end(JSON.stringify({}))
                    }
                })
        }
    })
}

function addSpecialization(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
                call('procedure', `dodajSpecjalizacjeLekarska('${usr.specialization.spec_name}', '${usr.specialization.payment}')`, (err, result) => {
                    if(err) {
                        res.end(JSON.stringify({
                            error: parseError(err)
                        }))
                    } else {
                        res.end(JSON.stringify({}))
                    }
                })
        }
    })
}

function editSpecialization(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
                call('procedure', `edytujWynagrodzenieZaSpecjalizacje('${usr.specialization.spec_name}', '${usr.specialization.payment}')`, (err, result) => {
                    if(err) {
                        res.end(JSON.stringify({
                            error: parseError(err)
                        }))
                    } else {
                        res.end(JSON.stringify({}))
                    }
                })
        }
    })
}

function showSchedule(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `wyswietlGrafik('${usr.pesel}')`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else {
                    res.end(JSON.stringify({
                        headers: [
                            {header: 'poniedzialek', label: 'poniedzialek', visible: true},
                            {header: 'wtorek', label: 'wtorek', visible: true},
                            {header: 'sroda', label: 'sroda', visible: true},
                            {header: 'czwartek', label: 'czwartek', visible: true},
                            {header: 'piatek', label: 'piatek', visible: true}
                        ],
                        rows: result
                    }))
                }
            })
        }
    })
}

function showTreatmentsSchedule(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `wyswietlListeZabiegowLekarza('${usr.pesel}')`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else {
                    res.end(JSON.stringify({
                        headers: [
                            {header: 'id_lekarze_zabieg', label: 'id_lekarze_zabieg', visible: false},
                            {header: 'pesel_pacjenta', label: 'pesel_pacjenta', visible: true},
                            {header: 'typ_zabiegu', label: 'typ_zabiegu', visible: true},
                            {header: 'data_wizyty', label: 'data_wizyty', visible: true}
                        ],
                        rows: result
                    }))
                }
            })
        }
    })
}

function showAssignmentDoctors(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `wyswietlLekarzyDlaZabiegu('${usr.id_lekarze_zabieg}')`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else {
                    res.end(JSON.stringify({
                        headers: [
                            {header: 'pesel', label: 'pesel', visible: true},
                            {header: 'imie', label: 'imie', visible: true},
                            {header: 'nazwisko', label: 'nazwisko', visible: true},
                            {header: 'specjalizacja', label: 'specjalizacja', visible: true}
                        ],
                        rows: result
                    }))
                }
            })
        }
    })
}

function showTablePatients(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `wyswietlPacjentow()`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else {
                    res.end(JSON.stringify({
                        headers: [
                            {header: 'pesel', label: 'pesel', visible: true},
                            {header: 'imie', label: 'imie', visible: true},
                            {header: 'nazwisko', label: 'nazwisko', visible: true},
                            {header: 'data_urodzenia', label: 'data_urodzenia', visible: true},
                            {header: 'data_rejestracji', label: 'data_rejestracji', visible: true}
                        ],
                        rows: result
                    }))
                }
            })
        }
    })
}

function showTreatmentsServices(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `wyswietlMozliweZabiegi()`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else {
                    res.end(JSON.stringify({
                        headers: [
                            {header: 'typ', label: 'typ', visible: true},
                            {header: 'cena', label: 'cena', visible: true},
                            {header: 'czas_trwania', label: 'czas_trwania', visible: true},
                            {header: 'id_wymaganych_specjalizacji_do_zabiegu', label: 'id_wymaganych_specjalizacji_do_zabiegu', visible: false}
                        ],
                        rows: result
                    }))
                }
            })
        }
    })
}

function showPatientsCards(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `wyswietlKartePacjentow()`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else {
                    res.end(JSON.stringify({
                        headers: [
                            {header: 'id_lekarze_zabieg', label: 'id_lekarze_zabieg', visible: false},
                            {header: 'pesel_pacjenta', label: 'pesel_pacjenta', visible: true},
                            {header: 'typ_zabiegu', label: 'typ_zabiegu', visible: true},
                            {header: 'data_wizyty', label: 'data_wizyty', visible: true}
                        ],
                        rows: result
                    }))
                }
            })
        }
    })
}

function showUsers(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `wyswietlUzytkownikow()`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else {
                    res.end(JSON.stringify({
                        headers: [
                            {header: 'nazwa', label: 'nazwa'},
                            {header: 'rola', label: 'rola'},
                            {header: 'pesel', label: 'pesel'}
                        ],
                        rows: result
                    }))
                }
            })
        }
    })
}

function login(usr, res) {
    databaseAccess(usr, (call, err) => {
        if(err) {
            res.end(JSON.stringify({
                error: parseError(err)
            }))
        } else {
            call('procedure', `wyswietlRole('${usr.login}')`, (err, result) => {
                if(err) {
                    res.end(JSON.stringify({
                        error: parseError(err)
                    }))
                } else if( !result.length || result[0].rola == null) {
                    res.end(JSON.stringify({
                        error: 'Konto nie ma przypisanej roli'
                    }))
                } else {
                    res.end(JSON.stringify({
                        'account-type': result[0].rola
                    }))
                }
            })
        }
    })
}

function unrecognisedCommand(res) {
    res.writeHead(400, headers)
    res.end(JSON.stringify({
        error: 'Nierozpoznana komenda'
    }))
}

async function databaseAccess(user, callback) {
    //static variable
    if(typeof databaseAccess.connections === 'undefined') {
        databaseAccess.connections = []
    } 

    const index = databaseAccess.connections.findIndex((v) => v.connInfo.user === user.login && v.connInfo.password === user.password)

    if(index > -1) {
        databaseAccess.connections[index].resume(callback)
    } else {
        const db = new MYSQL_DBMS(user.login, user.password)
        databaseAccess.connections.push(db)
        db.connect(callback)
    }
}

function parseError(err) {
    console.log(err.code)
    console.log(err)
    switch(err.code) {
        case 'ER_ACCESS_DENIED_ERROR':
            err = 'Niewlasciwy login lub haslo'
        break

        case 'ER_DBACCESS_DENIED_ERROR':
            err = 'Brak uprawnien'
        break

        case 'ER_NOT_SUPPORTED_AUTH_MODE':
            err = 'Niewlasciwy login lub haslo'
        break

        case 'ER_CANNOT_USER':
            err = 'Nie mozna utworzyc uzytkownika'
        break

        case 'ER_ROW_IS_REFERENCED_2':
            err = 'Nie można usunąć danej pozycji z powodu odniesienia do niej w innej tabeli.'
        break

        default:
            err = err.sqlMessage
    }

    return err
}