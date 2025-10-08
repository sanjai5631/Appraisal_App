using EAA.Application;
using EAA.Domain.DTO.Request.Cycle;
using EAA.Domain.DTO.Request.Mail;
using EAA.Domain.DTO.Response.Cycle;
using EAA.Infrastructure.Logic.Cycle;
using System;
using System.Collections.Generic;

namespace EAA.Services.Services.Cycle
{
    public class Cycle_Services : ICycle_Services
    {
        private readonly ICycle_infrastructure _cycleInfra;
        private readonly ErrorHandler _error;

        public Cycle_Services(ICycle_infrastructure cycleInfra, ErrorHandler error)
        {
            _cycleInfra = cycleInfra;
            _error = error;
        }

        public ApiResponse<List<CycleResponse_DTO>> GetAllCycles()
        {
            var response = new ApiResponse<List<CycleResponse_DTO>>();
            try
            {
                response.Data = _cycleInfra.GetAllCycles();
                response.StatusCode = 200;
                response.Message = "Cycles retrieved successfully";
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Cycle_Services -> GetAllCycles");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve cycles";
            }
            return response;
        }

        public ApiResponse<CycleResponse_DTO> GetCycleById(int cycleId)
        {
            var response = new ApiResponse<CycleResponse_DTO>();
            try
            {
                var cycle = _cycleInfra.GetCycleById(cycleId);
                if (cycle == null)
                {
                    response.StatusCode = 404;
                    response.Message = "Cycle not found";
                }
                else
                {
                    response.Data = cycle;
                    response.StatusCode = 200;
                    response.Message = "Cycle retrieved successfully";
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Cycle_Services -> GetCycleById");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve cycle";
            }
            return response;
        }

        public ApiResponse<CycleResponse_DTO> SaveCycle(CycleRequest_DTO request)
        {
            var response = new ApiResponse<CycleResponse_DTO>();
            try
            {
                var cycle = _cycleInfra.SaveCycle(request);
                if (cycle == null)
                {
                    response.StatusCode = 400;
                    response.Message = "Failed to create cycle";
                }
                else
                {
                    response.Data = cycle;
                    response.StatusCode = 201;
                    response.Message = "Cycle created successfully";
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Cycle_Services -> SaveCycle");
                response.StatusCode = 500;
                response.Message = "Failed to create cycle";
            }
            return response;
        }

        public ApiResponse<UpdateCycleResponse_DTO> UpdateCycle(int cycleId, UpdateCycleRequest_DTO request)
        {
            var response = new ApiResponse<UpdateCycleResponse_DTO>(); 
            try
            {
                var cycle = _cycleInfra.UpdateCycle(cycleId, request);
                if (cycle == null)
                {
                    response.StatusCode = 404;
                    response.Message = "Cycle not found or not updated";
                }
                else
                {
                    response.Data = cycle;
                    response.StatusCode = 200;
                    response.Message = "Cycle updated successfully";
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Cycle_Services -> UpdateCycle");
                response.StatusCode = 500;
                response.Message = "Failed to update cycle";
            }
            return response;
        }


        public ApiResponse<string> DeleteCycle(int cycleId)
        {
            var response = new ApiResponse<string>();
            try
            {
                var result = _cycleInfra.DeleteCycle(cycleId);
                response.Data = result;
                response.StatusCode = result.Contains("success") ? 200 : 404;
                response.Message = result;
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Cycle_Services -> DeleteCycle");
                response.StatusCode = 500;
                response.Message = "Failed to delete cycle";
            }
            return response;
        }

        public ApiResponse<EmployeeDTO> GetEmployeeById(int employeeId)
        {
            var response = new ApiResponse<EmployeeDTO>();
            try
            {
                var emp = _cycleInfra.GetEmployeeById(employeeId); // infrastructure method
                if (emp != null)
                {
                    response.Data = emp;
                    response.StatusCode = 200;
                    response.Message = "Employee found";
                }
                else
                {
                    response.Data = null;
                    response.StatusCode = 404;
                    response.Message = "Employee not found";
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, $"Error in Cycle_Services -> GetEmployeeById({employeeId})");
                response.Data = null;
                response.StatusCode = 500;
                response.Message = "Failed to fetch employee";
            }
            return response;
        }


        public ApiResponse<List<EmployeeDTO>> GetAllManagers()
        {
            var response = new ApiResponse<List<EmployeeDTO>>();
            try
            {
                var managers = _cycleInfra.GetAllManagers(); // infrastructure method
                response.Data = managers;
                response.StatusCode = managers.Any() ? 200 : 404;
                response.Message = managers.Any() ? "Managers fetched successfully" : "No managers found";
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Cycle_Services -> GetAllManagers");
                response.Data = null;
                response.StatusCode = 500;
                response.Message = "Failed to fetch managers";
            }
            return response;
        }
    }
}
