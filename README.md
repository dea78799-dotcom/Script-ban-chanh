-- [[ TẢI RAYFIELD ]]
local Rayfield = loadstring(game:HttpGet('https://sirius.menu/rayfield'))()

-- [[ CỬA SỔ CHÍNH ]]
local Window = Rayfield:CreateWindow({
   Name = "🍋menu bán chanh🍋 v3.310",
   Icon = 0,
   LoadingTitle = "Đang tải...",
   LoadingSubtitle = "by Assistant",
   ConfigurationSaving = { Enabled = false },
   Discord = { Enabled = false },
   KeySystem = false
})

-- SERVICES
local Players = game:GetService("Players")
local Player = Players.LocalPlayer
local Character = Player.Character or Player.CharacterAdded:Wait()
local RootPart = Character:WaitForChild("HumanoidRootPart")
local Workspace = game:GetService("Workspace")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local VirtualInputManager = game:GetService("VirtualInputManager")
local GuiService = game:GetService("GuiService")
local HttpService = game:GetService("HttpService")

Player.CharacterAdded:Connect(function(newChar)
    Character = newChar
    RootPart = Character:WaitForChild("HumanoidRootPart")
end)

-- STATE & THREADS & VALUES
local _G_AutoUpgrade = false
local _G_AutoHarvest = false
local _G_AutoRedeem = false
local _G_AutoClickLemonStand = false
local _G_AutoClickLemonDash = false
local _G_AutoClickLemonLabs = false
local _G_AutoClickLemonRobotics = false
local _G_AutoClickLemonRepublic = false
local _G_AutoBuild = false
local _G_AutoRebirth = false
local _G_AutoEvolve = false
local _G_AutoOffer = false
local _G_AutoRaiseOffer = false
local _G_AutoRejectOffer = false

local UpgradeAmount = 10
local RebirthDelay = 15
local FeedbackText = ""

local Threads = {
    Upgrade = nil,
    Build = nil,
    Harvest = nil,
    Redeem = nil,
    LemonStand = nil,
    LemonDash = nil,
    LemonLabs = nil,
    LemonRobotics = nil,
    LemonRepublic = nil,
    Rebirth = nil,
    Evolve = nil,
    Offer = nil,
    RaiseOffer = nil,
    RejectOffer = nil
}

-- ============================
-- HÀM GỬI WEBHOOK PHẢN HỒI
-- ============================
local WEBHOOK_URL = "https://discord.com/api/webhooks/1545333668187344957/jWX4F4hfLlZJ6-7uslrSamudPk_FsOQQf6QHcxJGFSbZxlsFZcSFgM5EVdJgSxI8niwy"
local requestFunc = (syn and syn.request) or (http and http.request) or request or http_request

local function SendWebhook(messageText)
    if not requestFunc then
        Rayfield:Notify({Title = "⚠️ Thất bại", Content = "Executor không hỗ trợ HTTP Request!", Duration = 3})
        return false
    end

    local payload = {
        ["username"] = "Feedback Bot",
        ["embeds"] = {{
            ["title"] = "📩 Phản hồi từ người dùng",
            ["color"] = 3447003,
            ["fields"] = {
                {
                    ["name"] = "👤 Người gửi",
                    ["value"] = Player.Name .. " (@" .. Player.DisplayName .. ")",
                    ["inline"] = true
                },
                {
                    ["name"] = "🆔 User ID",
                    ["value"] = tostring(Player.UserId),
                    ["inline"] = true
                },
                {
                    ["name"] = "📝 Nội dung",
                    ["value"] = messageText,
                    ["inline"] = false
                }
            },
            ["footer"] = {
                ["text"] = "Gửi lúc: " .. os.date("%H:%M:%S - %d/%m/%Y")
            }
        }}
    }

    local success, response = pcall(function()
        return requestFunc({
            Url = WEBHOOK_URL,
            Method = "POST",
            Headers = {
                ["Content-Type"] = "application/json"
            },
            Body = HttpService:JSONEncode(payload)
        })
    end)

    if success and response and (response.StatusCode == 200 or response.StatusCode == 204) then
        return true
    else
        return false
    end
end

-- ============================
-- HÀM GIẢ LẬP CẢM ỨNG UI
-- ============================
local function touchAtPosition(x, y)
    VirtualInputManager:SendTouchEvent(0, 0, x, y, game)
    task.wait(0.02)
    VirtualInputManager:SendTouchEvent(0, 2, x, y, game)
end

local function clickGuiObject(guiObject)
    if not guiObject then return end
    
    if firesignal then
        pcall(function() firesignal(guiObject.MouseButton1Click) end)
        pcall(function() firesignal(guiObject.Activated) end)
    else
        local pos = guiObject.AbsolutePosition
        local size = guiObject.AbsoluteSize
        local inset = GuiService:GetGuiInset()
        
        local x = pos.X + (size.X / 2)
        local y = pos.Y + (size.Y / 2) + inset.Y
        
        touchAtPosition(x, y)
    end
end

-- ============================
-- HÀM TÌM TYCOON CỦA NGƯỜI CHƠI
-- ============================
local function getMyTycoon()
    for _, tycoon in ipairs(Workspace:GetChildren()) do
        if tycoon.Name:sub(1, 6) == "Tycoon" then
            local owner = tycoon:FindFirstChild("Owner") or tycoon:FindFirstChild("OwnerValue")
            if owner and owner.Value == Player then
                return tycoon
            end
        end
    end

    for _, tycoon in ipairs(Workspace:GetChildren()) do
        if tycoon.Name:sub(1, 6) == "Tycoon" then
            if tycoon:FindFirstChild(Player.Name) or tycoon:FindFirstChild(Player.DisplayName) then
                return tycoon
            end
        end
    end

    local closestTycoon = nil
    local shortestDistance = math.huge
    if RootPart then
        for _, tycoon in ipairs(Workspace:GetChildren()) do
            if tycoon.Name:sub(1, 6) == "Tycoon" then
                local primaryPart = tycoon.PrimaryPart or tycoon:FindFirstChildWhichIsA("BasePart", true)
                if primaryPart then
                    local dist = (RootPart.Position - primaryPart.Position).Magnitude
                    if dist < shortestDistance then
                        shortestDistance = dist
                        closestTycoon = tycoon
                    end
                end
            end
        end
    end

    return closestTycoon
end

-- ============================
-- HÀM TỰ ĐỘNG MUA POWER LEVEL
-- ============================
local function UpgradePower(powerType, amount)
    amount = amount or 1
    local myTycoon = getMyTycoon() or Workspace:FindFirstChild("Tycoon9")
    if myTycoon then
        local remotes = myTycoon:FindFirstChild("Remotes")
        if remotes then
            local event = remotes:FindFirstChild("UpgradePowerLevel")
            if event and event:IsA("RemoteFunction") then
                local success, err = pcall(function()
                    event:InvokeServer(powerType, amount)
                end)
                if success then
                    Rayfield:Notify({Title = "🛒 Mua thành công", Content = "Đã nâng cấp: " .. powerType .. " (" .. myTycoon.Name .. ")", Duration = 2.5})
                else
                    Rayfield:Notify({Title = "⚠️ Thất bại", Content = "Lỗi khi gọi Remote!", Duration = 2.5})
                end
                return
            end
        end
    end
    Rayfield:Notify({Title = "⚠️ Lỗi", Content = "Không tìm thấy Remote UpgradePowerLevel trên Tycoon!", Duration = 3})
end

-- ============================
-- HÀM DỊCH CHUYỂN BẰNG CFRAME
-- ============================
local function teleportCFrame(cframe)
    if not RootPart then return end
    RootPart.CFrame = cframe
end

-- ============================
-- HÀM MUA NÔNG TRẠI (UNLOCK ORCHARD)
-- ============================
local function BuyOrchard()
    pcall(function()
        local myTycoon = getMyTycoon() or Workspace:FindFirstChild("Tycoon7")
        if myTycoon then
            local remotes = myTycoon:FindFirstChild("Remotes")
            if remotes then
                local unlockOrchard = remotes:FindFirstChild("UnlockOrchard")
                if unlockOrchard and unlockOrchard:IsA("RemoteFunction") then
                    unlockOrchard:InvokeServer()
                    Rayfield:Notify({Title = "🌳", Content = "Đã gửi lệnh Mua nông trại!", Duration = 3})
                    return
                end
            end
        end
        Workspace:WaitForChild("Tycoon7"):WaitForChild("Remotes"):WaitForChild("UnlockOrchard"):InvokeServer()
        Rayfield:Notify({Title = "🌳", Content = "Đã gửi lệnh Mua nông trại (Tycoon7)!", Duration = 3})
    end)
end

-- ============================
-- HÀM THỰC HIỆN NÂNG CẤP
-- ============================
local function DoUpgrade(amount)
    if not _G_AutoUpgrade then return end
    local tycoon = getMyTycoon() or Workspace:FindFirstChild("Tycoon2")
    if not tycoon then return end

    pcall(function()
        local purchases = tycoon:FindFirstChild("Purchases")
        if purchases then
            local lr1 = purchases:FindFirstChild("Lemon Republic")
            if lr1 then
                local lr2 = lr1:FindFirstChild("Lemon Republic")
                if lr2 then
                    local lr3 = lr2:FindFirstChild("Lemon Republic")
                    if lr3 then
                        local upgradeRemote = lr3:FindFirstChild("Upgrade")
                        if upgradeRemote and upgradeRemote:IsA("RemoteFunction") then
                            task.spawn(function()
                                for i = 1, amount do
                                    if not _G_AutoUpgrade then break end
                                    pcall(function() upgradeRemote:InvokeServer(1) end)
                                end
                            end)
                        end
                    end
                end
            end
        end
    end)

    local purchases = tycoon:FindFirstChild("Purchases")
    if not purchases then return end

    for _, item in pairs(purchases:GetDescendants()) do
        if not _G_AutoUpgrade then break end

        if item:IsA("RemoteFunction") and item.Name == "Upgrade" then
            task.spawn(function()
                for i = 1, amount do
                    if not _G_AutoUpgrade then break end
                    pcall(function()
                        item:InvokeServer(1)
                    end)
                end
            end)
        end
    end
end

-- ============================
-- HÀM THỰC HIỆN TÁI SINH
-- ============================
local function DoRebirth()
    pcall(function()
        local myTycoon = getMyTycoon()
        local rebirthRemote = nil
        
        if myTycoon and myTycoon:FindFirstChild("Remotes") and myTycoon.Remotes:FindFirstChild("Rebirth") then
            rebirthRemote = myTycoon.Remotes.Rebirth
        else
            rebirthRemote = Workspace:FindFirstChild("Rebirth", true) or ReplicatedStorage:FindFirstChild("Rebirth", true)
        end

        if rebirthRemote then
            if rebirthRemote:IsA("RemoteFunction") then
                rebirthRemote:InvokeServer(nil)
            elseif rebirthRemote:IsA("RemoteEvent") then
                rebirthRemote:FireServer(nil)
            end
        end
    end)
end

-- ============================
-- HÀM THỰC HIỆN TÁI SINH TRÁI (EVOLVE)
-- ============================
local function DoEvolve()
    pcall(function()
        local myTycoon = getMyTycoon()
        local evolveRemote = nil

        if myTycoon and myTycoon:FindFirstChild("Remotes") and myTycoon.Remotes:FindFirstChild("Evolve") then
            evolveRemote = myTycoon.Remotes.Evolve
        elseif Workspace:FindFirstChild("Tycoon4") and Workspace.Tycoon4:FindFirstChild("Remotes") and Workspace.Tycoon4.Remotes:FindFirstChild("Evolve") then
            evolveRemote = Workspace.Tycoon4.Remotes.Evolve
        else
            evolveRemote = Workspace:FindFirstChild("Evolve", true)
        end

        if evolveRemote then
            if evolveRemote:IsA("RemoteFunction") then
                evolveRemote:InvokeServer(nil)
            elseif evolveRemote:IsA("RemoteEvent") then
                evolveRemote:FireServer(nil)
            end
        end
    end)
end

-- ============================
-- HÀM LẤY PET SLIME
-- ============================
local function ClaimSlimePet()
    pcall(function()
        local myTycoon = getMyTycoon()
        local claimRemote = nil

        if myTycoon and myTycoon:FindFirstChild("Remotes") and myTycoon.Remotes:FindFirstChild("ClaimCompanion") then
            claimRemote = myTycoon.Remotes.ClaimCompanion
        elseif Workspace:FindFirstChild("Tycoon3") and Workspace.Tycoon3:FindFirstChild("Remotes") and Workspace.Tycoon3.Remotes:FindFirstChild("ClaimCompanion") then
            claimRemote = Workspace.Tycoon3.Remotes.ClaimCompanion
        else
            claimRemote = Workspace:FindFirstChild("ClaimCompanion", true)
        end

        if claimRemote then
            if claimRemote:IsA("RemoteFunction") then
                claimRemote:InvokeServer(2)
            elseif claimRemote:IsA("RemoteEvent") then
                claimRemote:FireServer(2)
            end
            Rayfield:Notify({Title = "🧪", Content = "Đã gửi lệnh nhận Pet Slime!", Duration = 3})
        else
            Rayfield:Notify({Title = "⚠️ Lỗi", Content = "Không tìm thấy Remote nhận Pet!", Duration = 3})
        end
    end)
end

-- ============================
-- HÀM XỬ LÝ HỢP ĐỒNG (OFFER)
-- ============================
local function SendOfferAction(actionType)
    pcall(function()
        local myTycoon = getMyTycoon()
        local offerRemote = nil
        
        if myTycoon and myTycoon:FindFirstChild("Remotes") and myTycoon.Remotes:FindFirstChild("PhoneOffer") then
            offerRemote = myTycoon.Remotes.PhoneOffer
        elseif Workspace:FindFirstChild("Tycoon7") and Workspace.Tycoon7:FindFirstChild("Remotes") and Workspace.Tycoon7.Remotes:FindFirstChild("PhoneOffer") then
            offerRemote = Workspace.Tycoon7.Remotes.PhoneOffer
        else
            offerRemote = Workspace:FindFirstChild("PhoneOffer", true)
        end

        if offerRemote then
            offerRemote:FireServer(actionType)
        end
    end)
end

local function AcceptContract() SendOfferAction("Accept") end
local function RaiseContract() SendOfferAction("Raise") end
local function RejectContract() SendOfferAction("Reject") end

-- ============================
-- HÀM TÌM QUẢ "Fruit" TRONG LemonTree
-- ============================
local function FindFruitsInLemonTrees()
    local fruits = {}
    for _, v in pairs(Workspace:GetDescendants()) do
        if v:IsA("BasePart") and v.Name == "Fruit" and v.Parent then
            local parentModel = v:FindFirstAncestor("LemonTree")
            if parentModel and parentModel:IsA("Model") and parentModel.Name == "LemonTree" then
                table.insert(fruits, v)
            end
        end
    end
    return fruits
end

local function FindClickDetector(fruit)
    local clickPart = fruit:FindFirstChild("ClickFruitPart")
    if clickPart then
        local clickDetector = clickPart:FindFirstChildWhichIsA("ClickDetector")
        if clickDetector then return clickDetector end
    end
    return fruit:FindFirstChildWhichIsA("ClickDetector")
end

local function ClickFruit(fruit)
    local clickDetector = FindClickDetector(fruit)
    if not clickDetector then return false end

    if fireclickdetector then
        pcall(function() fireclickdetector(clickDetector) end)
        return true
    end

    if clickDetector.MouseClick then
        pcall(function() firesignal(clickDetector.MouseClick) end)
        return true
    end

    return false
end

local function HarvestOnce()
    local fruits = FindFruitsInLemonTrees()
    if #fruits == 0 then return false end

    for _, fruit in ipairs(fruits) do
        if not _G_AutoHarvest then break end
        if fruit and fruit.Parent then
            teleportCFrame(CFrame.new(fruit.Position + Vector3.new(0, 2, 0)))
            task.wait(0.02)
            ClickFruit(fruit)
            task.wait(0.02)
        end
    end
    return true
end

-- ============================
-- HÀM NHẶT BAO TIỀN (SIÊU TOC)
-- ============================
local function CollectMoneyOnce()
    pcall(function()
        local Event = ReplicatedStorage:WaitForChild("Core"):WaitForChild("RemoteRequest")["DropService.Redeem"]
        if Event then
            local randomVal = tostring(math.random(1, 50000))
            if Event:IsA("RemoteFunction") then
                Event:InvokeServer(randomVal)
            elseif Event:IsA("RemoteEvent") then
                Event:FireServer(randomVal)
            end
        end
    end)
end

local function ClickIncomeStream(itemName)
    local myTycoon = getMyTycoon() or Workspace:FindFirstChild("Tycoon2")
    if myTycoon and myTycoon:FindFirstChild("Remotes") and myTycoon.Remotes:FindFirstChild("WakeIncomeStream") then
        pcall(function()
            myTycoon.Remotes.WakeIncomeStream:InvokeServer(itemName)
        end)
    else
        for _, v in pairs(Workspace:GetDescendants()) do
            if (v:IsA("RemoteFunction") or v:IsA("RemoteEvent")) and v.Name == "WakeIncomeStream" then
                pcall(function()
                    if v:IsA("RemoteFunction") then
                        v:InvokeServer(itemName)
                    else
                        v:FireServer(itemName)
                    end
                end)
            end
        end
    end
end

-- ============================
-- TAB SHOP (MUA ĐỒ)
-- ============================
local ShopTab = Window:CreateTab("Mua đồ", 4483362458)

ShopTab:CreateParagraph({
    Title = "🛒 Cửa hàng Tycoon",
    Content = "Tự động xác định Tycoon của bạn và thực hiện các nâng cấp PowerLevel."
})

ShopTab:CreateButton({
    Name = "mua quản lí",
    Callback = function()
        UpgradePower("Manage", 1)
    end,
})

ShopTab:CreateButton({
    Name = "mua thêm speed",
    Callback = function()
        UpgradePower("WalkSpeed", 1)
    end,
})

ShopTab:CreateButton({
    Name = "mua nâng cấp nhiều hơn",
    Callback = function()
        UpgradePower("UpgradeStack", 1)
    end,
})

ShopTab:CreateButton({
    Name = "lụm trái thêm tiền",
    Callback = function()
        UpgradePower("ClickFruitValue", 1)
    end,
})

-- ============================
-- TAB FARM
-- ============================
local FarmTab = Window:CreateTab("Farm", 4483362458)

FarmTab:CreateParagraph({
    Title = "⚠️ LƯU Ý QUAN TRỌNG",
    Content = "Khuyến cáo: KHÔNG ĐƯỢC BẬT 2 TÍNH NĂNG CÙNG 1 LÚC TRONG TAB FARM! Hãy tắt tính năng đang chạy trước khi bật tính năng mới."
})

FarmTab:CreateButton({
    Name = "Mua nông trại",
    Callback = function()
        BuyOrchard()
    end,
})

FarmTab:CreateParagraph({
    Title = "⚡ Nâng cấp Cực Nhanh",
    Content = "Tự động gửi gói tin nâng cấp liên tục không bị gián đoạn."
})

FarmTab:CreateToggle({
    Name = "Nâng cấp (Siêu Nhanh)",
    CurrentValue = false,
    Flag = "ToggleUpgrade",
    Callback = function(Value)
        _G_AutoUpgrade = Value
        if Threads.Upgrade then
            task.cancel(Threads.Upgrade)
            Threads.Upgrade = nil
        end

        if _G_AutoUpgrade then
            Rayfield:Notify({Title = "⚡", Content = "Đã bật tự động nâng cấp Siêu Nhanh!", Duration = 2})
            Threads.Upgrade = task.spawn(function()
                while _G_AutoUpgrade do
                    DoUpgrade(UpgradeAmount)
                    task.wait(0.1)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT nâng cấp!", Duration = 2})
        end
    end
})

FarmTab:CreateSlider({
    Name = "Số lần gửi lệnh / 1 nhịp",
    Range = {1, 100},
    Increment = 1,
    Suffix = "lần",
    CurrentValue = 10,
    Flag = "SliderUpgradeAmount",
    Callback = function(Value)
        UpgradeAmount = Value
    end,
})

FarmTab:CreateParagraph({
    Title = "🏠 Tự động xây nhà",
    Content = "Mua các nút còn thiếu trong Tycoon."
})

FarmTab:CreateButton({
    Name = "Kiểm tra Tycoon hiện tại",
    Callback = function()
        local myTycoon = getMyTycoon()
        if myTycoon then
            Rayfield:Notify({Title = "🏠 Tycoon", Content = "Đã xác nhận: " .. myTycoon.Name, Duration = 3})
        else
            Rayfield:Notify({Title = "⚠️ Lỗi", Content = "Không tìm thấy Tycoon nào!", Duration = 3})
        end
    end,
})

FarmTab:CreateToggle({
    Name = "Tự động xây dựng nhà",
    CurrentValue = false,
    Flag = "ToggleBuildHouse",
    Callback = function(Value)
        _G_AutoBuild = Value
        if Threads.Build then
            task.cancel(Threads.Build)
            Threads.Build = nil
        end

        if _G_AutoBuild then
            Rayfield:Notify({Title = "✅", Content = "Đã bật tự động xây dựng!", Duration = 2})
            Threads.Build = task.spawn(function()
                while _G_AutoBuild do
                    local myTycoon = getMyTycoon()
                    if myTycoon then
                        for _, obj in pairs(myTycoon:GetDescendants()) do
                            if not _G_AutoBuild then break end

                            if obj:IsA("RemoteFunction") and (obj.Name == "Purchase" or obj.Name == "PurchaseBuyEffect") then
                                task.spawn(function()
                                    pcall(function() obj:InvokeServer(false, false) end)
                                end)
                            elseif obj:IsA("RemoteEvent") and (obj.Name == "Purchase" or obj.Name == "PurchaseBuyEffect") then
                                task.spawn(function()
                                    pcall(function() obj:FireServer(false, false) end)
                                end)
                            end
                        end
                    end
                    task.wait(0.1)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT tự động xây nhà!", Duration = 2})
        end
    end
})

-- ============================
-- TAB HỢP ĐỒNG
-- ============================
local ContractTab = Window:CreateTab("Hợp Đồng", 4483362458)

ContractTab:CreateButton({
    Name = "Đồng ý hợp đồng",
    Callback = function()
        AcceptContract()
        Rayfield:Notify({Title = "📜", Content = "Đã đồng ý hợp đồng!", Duration = 2})
    end,
})

ContractTab:CreateToggle({
    Name = "Tự động đồng ý",
    CurrentValue = false,
    Flag = "ToggleAutoOffer",
    Callback = function(Value)
        _G_AutoOffer = Value
        if Threads.Offer then
            task.cancel(Threads.Offer)
            Threads.Offer = nil
        end

        if _G_AutoOffer then
            Rayfield:Notify({Title = "📜", Content = "Đã BẬT tự động đồng ý hợp đồng!", Duration = 2})
            Threads.Offer = task.spawn(function()
                while _G_AutoOffer do
                    AcceptContract()
                    task.wait(5)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT tự động đồng ý!", Duration = 2})
        end
    end
})

ContractTab:CreateButton({
    Name = "Thêm tiền hợp đồng",
    Callback = function()
        RaiseContract()
        Rayfield:Notify({Title = "💵", Content = "Đã yêu cầu tăng tiền!", Duration = 2})
    end,
})

ContractTab:CreateToggle({
    Name = "Tự động kêu thêm tiền",
    CurrentValue = false,
    Flag = "ToggleAutoRaiseOffer",
    Callback = function(Value)
        _G_AutoRaiseOffer = Value
        if Threads.RaiseOffer then
            task.cancel(Threads.RaiseOffer)
            Threads.RaiseOffer = nil
        end

        if _G_AutoRaiseOffer then
            Rayfield:Notify({Title = "💵", Content = "Đã BẬT tự động tăng tiền!", Duration = 2})
            Threads.RaiseOffer = task.spawn(function()
                while _G_AutoRaiseOffer do
                    RaiseContract()
                    task.wait(5)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT!", Duration = 2})
        end
    end
})

ContractTab:CreateButton({
    Name = "Từ chối hợp đồng",
    Callback = function()
        RejectContract()
        Rayfield:Notify({Title = "❌", Content = "Đã từ chối hợp đồng!", Duration = 2})
    end,
})

ContractTab:CreateToggle({
    Name = "Tự động từ chối",
    CurrentValue = false,
    Flag = "ToggleAutoRejectOffer",
    Callback = function(Value)
        _G_AutoRejectOffer = Value
        if Threads.RejectOffer then
            task.cancel(Threads.RejectOffer)
            Threads.RejectOffer = nil
        end

        if _G_AutoRejectOffer then
            Rayfield:Notify({Title = "❌", Content = "Đã BẬT tự động từ chối!", Duration = 2})
            Threads.RejectOffer = task.spawn(function()
                while _G_AutoRejectOffer do
                    RejectContract()
                    task.wait(5)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT!", Duration = 2})
        end
    end
})

-- ============================
-- TAB TÁI SINH (REBIRTH)
-- ============================
local RebirthTab = Window:CreateTab("Tái Sinh", 4483362458)

RebirthTab:CreateButton({
    Name = "Tái sinh ngay",
    Callback = function()
        DoRebirth()
        Rayfield:Notify({Title = "🔄", Content = "Đã thực hiện tái sinh!", Duration = 2})
    end,
})

RebirthTab:CreateSlider({
    Name = "Thời gian tái sinh (Phút)",
    Range = {1, 180},
    Increment = 1,
    Suffix = "phút",
    CurrentValue = 15,
    Flag = "SliderRebirthDelay",
    Callback = function(Value)
        RebirthDelay = Value
    end,
})

RebirthTab:CreateToggle({
    Name = "Tự động tái sinh",
    CurrentValue = false,
    Flag = "ToggleAutoRebirth",
    Callback = function(Value)
        _G_AutoRebirth = Value
        if Threads.Rebirth then
            task.cancel(Threads.Rebirth)
            Threads.Rebirth = nil
        end

        if _G_AutoRebirth then
            Rayfield:Notify({Title = "🔄", Content = "Đã BẬT tự động tái sinh sau " .. RebirthDelay .. " phút!", Duration = 3})
            Threads.Rebirth = task.spawn(function()
                while _G_AutoRebirth do
                    local totalWaitSeconds = RebirthDelay * 60
                    for i = 1, totalWaitSeconds do
                        if not _G_AutoRebirth then break end
                        task.wait(1)
                    end
                    if _G_AutoRebirth then
                        DoRebirth()
                    end
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT tái sinh tự động!", Duration = 2})
        end
    end
})

RebirthTab:CreateParagraph({
    Title = "🍋 Tái sinh trái (Evolve)",
    Content = "Thực hiện tiến hóa/tái sinh trái cây trong Tycoon."
})

RebirthTab:CreateButton({
    Name = "Tái sinh trái",
    Callback = function()
        DoEvolve()
        Rayfield:Notify({Title = "🍋", Content = "Đã thực hiện Tái sinh trái!", Duration = 2})
    end,
})

RebirthTab:CreateToggle({
    Name = "tự động tái sinh trái",
    CurrentValue = false,
    Flag = "ToggleAutoEvolve",
    Callback = function(Value)
        _G_AutoEvolve = Value
        if Threads.Evolve then
            task.cancel(Threads.Evolve)
            Threads.Evolve = nil
        end

        if _G_AutoEvolve then
            Rayfield:Notify({Title = "🍋", Content = "Đã BẬT tự động tái sinh trái (Mỗi 30s)!", Duration = 3})
            Threads.Evolve = task.spawn(function()
                while _G_AutoEvolve do
                    DoEvolve()
                    for i = 1, 30 do
                        if not _G_AutoEvolve then break end
                        task.wait(1)
                    end
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT tự động tái sinh trái!", Duration = 2})
        end
    end
})

-- ============================
-- TAB AUTO HARVEST
-- ============================
local HarvestTab = Window:CreateTab("Auto Harvest", 4483362458)

HarvestTab:CreateToggle({
    Name = "Tự động hái quả",
    CurrentValue = false,
    Flag = "ToggleHarvest",
    Callback = function(Value)
        _G_AutoHarvest = Value
        if Threads.Harvest then
            task.cancel(Threads.Harvest)
            Threads.Harvest = nil
        end

        if _G_AutoHarvest then
            Threads.Harvest = task.spawn(function()
                while _G_AutoHarvest do
                    HarvestOnce()
                    task.wait(0.1)
                end
            end)
        end
    end
})

HarvestTab:CreateToggle({
    Name = "Nhặt bao tiền",
    CurrentValue = false,
    Flag = "ToggleCollectMoney",
    Callback = function(Value)
        _G_AutoRedeem = Value
        if Threads.Redeem then
            task.cancel(Threads.Redeem)
            Threads.Redeem = nil
        end

        if _G_AutoRedeem then
            Threads.Redeem = task.spawn(function()
                while _G_AutoRedeem do
                    CollectMoneyOnce()
                    task.wait(0.0001)
                end
            end)
        end
    end
})

-- ============================
-- TAB CLICK
-- ============================
local ClickTab = Window:CreateTab("Click", 4483362458)

ClickTab:CreateToggle({
    Name = "Auto Click LemonStand",
    CurrentValue = false,
    Flag = "ToggleClickLemonStand",
    Callback = function(Value)
        _G_AutoClickLemonStand = Value
        if Threads.LemonStand then
            task.cancel(Threads.LemonStand)
            Threads.LemonStand = nil
        end

        if _G_AutoClickLemonStand then
            Threads.LemonStand = task.spawn(function()
                while _G_AutoClickLemonStand do
                    ClickIncomeStream("LemonStand")
                    task.wait(0.05)
                end
            end)
        end
    end
})

ClickTab:CreateToggle({
    Name = "Auto Click LemonDash",
    CurrentValue = false,
    Flag = "ToggleClickLemonDash",
    Callback = function(Value)
        _G_AutoClickLemonDash = Value
        if Threads.LemonDash then
            task.cancel(Threads.LemonDash)
            Threads.LemonDash = nil
        end

        if _G_AutoClickLemonDash then
            Threads.LemonDash = task.spawn(function()
                while _G_AutoClickLemonDash do
                    ClickIncomeStream("LemonDash")
                    task.wait(0.05)
                end
            end)
        end
    end
})

ClickTab:CreateToggle({
    Name = "Auto Click LemonLabs",
    CurrentValue = false,
    Flag = "ToggleClickLemonLabs",
    Callback = function(Value)
        _G_AutoClickLemonLabs = Value
        if Threads.LemonLabs then
            task.cancel(Threads.LemonLabs)
            Threads.LemonLabs = nil
        end

        if _G_AutoClickLemonLabs then
            Threads.LemonLabs = task.spawn(function()
                while _G_AutoClickLemonLabs do
                    ClickIncomeStream("LemonLabs")
                    task.wait(0.05)
                end
            end)
        end
    end
})

ClickTab:CreateToggle({
    Name = "Auto Click LemonRobotics",
    CurrentValue = false,
    Flag = "ToggleClickLemonRobotics",
    Callback = function(Value)
        _G_AutoClickLemonRobotics = Value
        if Threads.LemonRobotics then
            task.cancel(Threads.LemonRobotics)
            Threads.LemonRobotics = nil
        end

        if _G_AutoClickLemonRobotics then
            Threads.LemonRobotics = task.spawn(function()
                while _G_AutoClickLemonRobotics do
                    ClickIncomeStream("LemonRobotics")
                    task.wait(0.05)
                end
            end)
        end
    end
})

ClickTab:CreateToggle({
    Name = "Auto click cộng hòa",
    CurrentValue = false,
    Flag = "ToggleClickLemonRepublic",
    Callback = function(Value)
        _G_AutoClickLemonRepublic = Value
        if Threads.LemonRepublic then
            task.cancel(Threads.LemonRepublic)
            Threads.LemonRepublic = nil
        end

        if _G_AutoClickLemonRepublic then
            Threads.LemonRepublic = task.spawn(function()
                while _G_AutoClickLemonRepublic do
                    ClickIncomeStream("LemonRepublic")
                    task.wait(0.05)
                end
            end)
        end
    end
})

-- ============================
-- TAB PET
-- ============================
local PetTab = Window:CreateTab("Pet", 4483362458)

PetTab:CreateParagraph({
    Title = "⚠️ LƯU Ý",
    Content = "Bạn cần phải hoàn thành nhiệm vụ mới lấy được do tab pet đang sửa chữa"
})

PetTab:CreateButton({
    Name = "Lấy pet slime",
    Callback = function()
        ClaimSlimePet()
    end,
})

-- ============================
-- TAB PHẢN HỒI (FEEDBACK)
-- ============================
local FeedbackTab = Window:CreateTab("Phản hồi", 4483362458)

FeedbackTab:CreateParagraph({
    Title = "⚠️ QUY ĐỊNH PHẢN HỒI",
    Content = "Tất cả phản hồi sẽ gửi thông tin Tên & ID Roblox của bạn đến Admin. Nghiêm cấm gửi tin nhắn spam, troll hoặc xúc phạm! Nếu cố tình vi phạm, tài khoản/nhân vật của bạn sẽ bị BAN và script sẽ vĩnh viễn không cho phép bạn sử dụng nữa."
})

FeedbackTab:CreateInput({
    Name = "Nội dung phản hồi",
    PlaceholderText = "Nhập góp ý, báo lỗi hoặc phản hồi tại đây...",
    RemoveTextOnFocus = false,
    Callback = function(Text)
        FeedbackText = Text
    end,
})

FeedbackTab:CreateButton({
    Name = "Gửi phản hồi",
    Callback = function()
        if FeedbackText == "" or #FeedbackText:gsub("%s+", "") == 0 then
            Rayfield:Notify({Title = "⚠️ Cảnh báo", Content = "Vui lòng nhập nội dung trước khi gửi!", Duration = 3})
            return
        end

        local success = SendWebhook(FeedbackText)
        if success then
            Rayfield:Notify({Title = "✅ Thành công", Content = "Phản hồi của bạn đã được gửi đến Admin!", Duration = 3})
        else
            Rayfield:Notify({Title = "❌ Thất bại", Content = "Không thể gửi phản hồi. Vui lòng thử lại sau!", Duration = 3})
        end
    end,
})

Rayfield:Notify({Title = "🍋", Content = "🍋menu bán chanh🍋 v3.310 đã sẵn sàng!", Duration = 3})
