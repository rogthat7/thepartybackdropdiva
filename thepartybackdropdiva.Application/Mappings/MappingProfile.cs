using AutoMapper;
using thepartybackdropdiva.Domain.Entities;
using thepartybackdropdiva.Application.DTOs;

namespace thepartybackdropdiva.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<MenuItemDto, MenuItem>().ForMember(dest => dest.Id, opt => opt.Ignore());
        CreateMap<CateringMenuDto, CateringMenu>().ForMember(dest => dest.Id, opt => opt.Ignore());

        CreateMap<MenuItem, MenuItemDto>();
        CreateMap<CateringMenu, CateringMenuDto>();
        CreateMap<BackdropCollectionDto, BackdropCollection>().ForMember(dest => dest.Id, opt => opt.Ignore());
        CreateMap<BackdropImageDto, BackdropImage>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.BackdropCollectionId, opt => opt.Ignore());
        CreateMap<BackdropThemeDto, BackdropTheme>().ForMember(dest => dest.Id, opt => opt.Ignore());

        CreateMap<BackdropCollection, BackdropCollectionDto>();
        CreateMap<BackdropImage, BackdropImageDto>();
        CreateMap<BackdropTheme, BackdropThemeDto>();

    }
}
