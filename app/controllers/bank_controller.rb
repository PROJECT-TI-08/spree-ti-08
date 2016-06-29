require 'net/sftp'
require 'typhoeus'
require 'nokogiri'

class BankController < ApplicationController
   #before_filter :authenticate_user!

def transferir(monto,origen,destino)
    url = Rails.configuration.bank_api_url + 'trx'
    request = Typhoeus::Request.new(
    url, 
    method: :put,
    body: {
      monto:   monto.to_i,
      origen:  origen,
      destino: destino
    },
    headers: {'Content-Type'=> "application/x-www-form-urlencoded"})
    response = request.run
    if response.success?                 
       return {:status => true, :result =>  JSON.parse(response.body)}               
    else
       return {:status => false, :result =>  JSON.parse(response.body)}
    end
  end

  def obtener_cuenta(cuenta)
    url = Rails.configuration.bank_api_url + 'cuenta/' + cuenta
    request = Typhoeus::Request.new(
    url, 
    method: :get,
    headers: { ContentType: "application/json"})
    response = request.run
    if response.success?                 
       return {:status => true, :result =>  JSON.parse(response.body)}               
    else
       return {:status => false}
    end
  end

  def obtener_cartola(fechaInicio,fechaFin,cuenta)
    url = Rails.configuration.bank_api_url + 'cartola'
    request = Typhoeus::Request.new(
    url, 
    method: :post,
    body: { 
      fechaInicio: fechaInicio,
      fechaFin:  fechaFin,
      id: cuenta
    },
    headers: { ContentType: "application/json"})
    response = request.run
    if response.success?                 
       return {:status => true, :result =>  JSON.parse(response.body)}               
    else
       return {:status => false}
    end
  end

  def obtener_transacciones
    fecha = params.require(:fecha)   
    if fecha == '0'
      fechaInicio = '2016-04-01'
      fechaFin    = '2016-07-01'
    else
      fechaInicio = params.require(:fecha)
      fechaFin    = params.require(:fecha)
    end
    new_fin = fechaFin.to_datetime + 24.hours
    response = obtener_cartola(fechaInicio.to_datetime.strftime('%Q'),new_fin.to_datetime.strftime('%Q'),
      Rails.configuration.bank_account)
    respond_to do |format|
      format.json  { render json: {:status => true,:result => response} }
      format.html  { render json: {:status => true,:result => response} }
    end
  end

  def save_saldo  
    begin
      response = obtener_cuenta(Rails.configuration.bank_account)
      logger.debug(response)
      date     = DateTime.now
      if(response[:status])
        SaldoInfo.create!({
             :valor    => response[:result][0]['saldo'], 
             :date   => date})
      end
      respond_to do |format|
        format.json  { render json: {:status => true,:result => response} }
        format.html  { render json: {:status => true,:result => response} }
      end
    rescue => ex
      logger.debug(ex.message)
      respond_to do |format|
        format.json  { render json: {:status => false,:result => ex.message} }
        format.html  { render json: {:status => false,:result => ex.message} }
      end
    end
  end

end
