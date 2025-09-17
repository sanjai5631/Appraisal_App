using EAA.Application;
using EAA.Domain.DTO.Request.Cycle;
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
    }
}
