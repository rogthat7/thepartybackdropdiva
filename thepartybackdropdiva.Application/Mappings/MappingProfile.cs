using AutoMapper;
using thepartybackdropdiva.Domain.Entities;
using thepartybackdropdiva.Application.DTOs;

namespace thepartybackdropdiva.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<MenuItem, MenuItemDto>();
        CreateMap<CateringMenu, CateringMenuDto>();
        CreateMap<BackdropTheme, BackdropThemeDto>();
        CreateMap<BackdropCollection, BackdropCollectionDto>();
        CreateMap<BackdropImage, BackdropImageDto>();

    }
}
